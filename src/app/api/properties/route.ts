import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        address: {
          include: {
            state: true,
            country: true,
            positions: true,
          },
        },
      },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
    
    // Create property with transaction to ensure all related data is created
    const property = await prisma.$transaction(async (prisma) => {
      // Create property
      const property = await prisma.property.create({
        data: {
          slug,
          title: data.title,
          description: data.description,
          price: data.price,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          squareMeters: data.squareMeters,
          propertyType: data.propertyType,
          listingType: data.listingType,
          isAvailable: data.isAvailable ?? true,
          yearBuilt: data.yearBuilt,
          parkingSpaces: data.parkingSpaces,
          amenities: data.amenities,
          quantity: data.quantity || 1,
          images: {
            create: data.images?.map((url: string) => ({
              url,
            })) || [],
          },
        },
      })

      // Create address if provided
      if (data.address) {        
        await prisma.address.create({
          data: {
            propertyId: property.id,
            city: data.address.city || null,
            postalCode: data.address.postalCode || null,
            streetName: data.address.streetName || null,
            description: data.address.description || null,
            positions: data.address.positions && data.address.positions.latitude && data.address.positions.longitude ? {
              create: {
                latitude: data.address.positions.latitude,
                longitude: data.address.positions.longitude,
              }
            } : undefined
          },
        })
      }

      return property
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the property' },
      { status: 500 }
    )
  }
}