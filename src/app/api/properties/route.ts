import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';
import { z } from 'zod';

const amenitySchema = z.object({
    name: z.string(),
    icon: z.string().optional(),
});

const propertySchema = z.object({
    title: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true },
        });

        if (!property) {
            return NextResponse.json({ error: 'Propiedad no encontrada' }, { status: 404 });
        }

        return NextResponse.json(property);
    } else {
        const properties = await prisma.property.findMany({
            include: { images: true },
        });

        return NextResponse.json(properties);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = propertySchema.parse(body);

        const property = await prisma.property.create({
            data: {
                ...validatedData,
                amenities: JSON.stringify(validatedData.amenities),
                images: {
                    create: body.images?.map((url: string) => ({ url })) ?? [],
                },
            },
            include: { images: true },
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
