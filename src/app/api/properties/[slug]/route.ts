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
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la propiedad
    await prisma.property.delete({
      where: { slug },
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
