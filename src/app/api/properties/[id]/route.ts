import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { z } from 'zod';

const amenitySchema = z.object({
    name: z.string(),
    icon: z.string().optional(),
});

const propertySchema = z.object({
    title: z.string().min(1).max(100),
    slug: z.string().min(1).max(250),
    description: z.string().min(1),
    price: z.number().positive(),
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().int().positive(),
    squareMeters: z.number().positive(),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    propertyType: z.string().min(1),
    listingType: z.string().min(1),
    isAvailable: z.boolean(),
    yearBuilt: z.number().int().positive().optional(),
    parkingSpaces: z.number().int().nonnegative().optional(),
    amenities: z.array(amenitySchema),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const body = await request.json();
        const validatedData = propertySchema.parse(body);

        const property = await prisma.property.update({
            where: { id: parseInt(id) },
            data: {
                ...validatedData,
                amenities: JSON.stringify(validatedData.amenities),
                images: {
                    deleteMany: {},
                    create: body.images?.map((url: string) => ({ url })) ?? [],
                },
            },
            include: { images: true },
        });

        return NextResponse.json(property);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        await prisma.property.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Propiedad eliminada con éxito' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar la propiedad' }, { status: 500 });
    }
}

