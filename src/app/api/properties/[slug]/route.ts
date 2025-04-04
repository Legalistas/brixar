import { NextResponse } from "next/server";
import { prisma } from '@/libs/prisma'

// GET - Obtener una propiedad por su slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const property = await prisma.property.findUnique({
      where: {
        slug,
      },
      include: {
        images: true,
        address: {
          include: {
            country: true,
            state: true,
            positions: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error al buscar la propiedad:", error);
    return NextResponse.json(
      { error: "Error al buscar la propiedad" },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar una propiedad por su slug
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const data = await request.json();

    // Verificar si la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { slug },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Validar el estado si se proporciona
    if (data.status) {
      const validStatuses = ['EN_VENTA', 'RESERVADA', 'VENDIDA'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          { error: "Estado de propiedad no válido" },
          { status: 400 }
        );
      }
    }

    // Actualizar la propiedad
    const updatedProperty = await prisma.property.update({
      where: { slug },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error al actualizar la propiedad:", error);
    return NextResponse.json(
      { error: "Error al actualizar la propiedad" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una propiedad por su slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Verificar si la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { slug },
      include: {
        images: true,
        address: {
          include: {
            positions: true
          }
        },
        inquiries: {
          include: {
            messages: true
          }
        },
        sales: {
          include: {
            transactions: true
          }
        },
        Visit: true
      }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Usar transacción para eliminar todo en cascada manualmente
    await prisma.$transaction(async (tx) => {
      // 1. Eliminar transacciones de ventas relacionadas con la propiedad
      if (existingProperty.sales?.length > 0) {
        for (const sale of existingProperty.sales) {
          if (sale.transactions?.length > 0) {
            await tx.saleTransaction.deleteMany({
              where: { saleId: sale.id }
            });
          }
        }
      }

      // 2. Eliminar ventas relacionadas con la propiedad
      await tx.sale.deleteMany({
        where: { propertyId: existingProperty.id }
      });

      // 3. Eliminar mensajes de consultas relacionadas con la propiedad
      if (existingProperty.inquiries?.length > 0) {
        for (const inquiry of existingProperty.inquiries) {
          await tx.inquiryMessage.deleteMany({
            where: { inquiryId: inquiry.id }
          });
        }
      }

      // 4. Eliminar consultas relacionadas con la propiedad
      await tx.inquiry.deleteMany({
        where: { propertyId: existingProperty.id }
      });

      // 5. Eliminar visitas relacionadas con la propiedad
      await tx.visit.deleteMany({
        where: { propertyId: existingProperty.id }
      });

      // 6. Eliminar posiciones geográficas relacionadas con las direcciones
      if (existingProperty.address?.length > 0) {
        for (const addr of existingProperty.address) {
          if (addr.positions?.length > 0) {
            await tx.positions.deleteMany({
              where: { addressId: addr.id }
            });
          }
        }
      }

      // 7. Eliminar direcciones relacionadas con la propiedad
      await tx.address.deleteMany({
        where: { propertyId: existingProperty.id }
      });

      // 8. Eliminar imágenes relacionadas con la propiedad
      await tx.propertyImage.deleteMany({
        where: { propertyId: existingProperty.id }
      });

      // 9. Finalmente eliminar la propiedad
      await tx.property.delete({
        where: { id: existingProperty.id }
      });
    });

    return NextResponse.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la propiedad:", error);
    return NextResponse.json(
      { error: "Error al eliminar la propiedad" },
      { status: 500 }
    );
  }
}
