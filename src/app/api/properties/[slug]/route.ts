import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'

// GET a property by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    const property = await prisma.property.findUnique({
      where: { slug },
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

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching the property' },
      { status: 500 }
    )
  }
}

// UPDATE a property by slug
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const data = await request.json()
    
    // Find the property first
    const existingProperty = await prisma.property.findUnique({
      where: { slug },
      include: {
        images: true,
        address: true,
      },
    })

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Generate new slug if title changes
    const newSlug = data.title
      ? data.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      : slug
    
    // Update property with transaction
    const updatedProperty = await prisma.$transaction(async (prisma) => {
      // Update property
      const property = await prisma.property.update({
        where: { slug },
        data: {
          slug: newSlug,
          title: data.title ?? existingProperty.title,
          description: data.description ?? existingProperty.description,
          price: data.price ?? existingProperty.price,
          bedrooms: data.bedrooms ?? existingProperty.bedrooms,
          bathrooms: data.bathrooms ?? existingProperty.bathrooms,
          squareMeters: data.squareMeters ?? existingProperty.squareMeters,
          propertyType: data.propertyType ?? existingProperty.propertyType,
          listingType: data.listingType ?? existingProperty.listingType,
          isAvailable: data.isAvailable ?? existingProperty.isAvailable,
          yearBuilt: data.yearBuilt ?? existingProperty.yearBuilt,
          parkingSpaces: data.parkingSpaces ?? existingProperty.parkingSpaces,
          amenities: data.amenities ?? existingProperty.amenities,
          quantity: data.quantity ?? existingProperty.quantity,
        },
      })

      // Update images if provided
      if (data.images) {
        // Delete existing images
        await prisma.propertyImage.deleteMany({
          where: { propertyId: property.id },
        })

        // Create new images
        await prisma.propertyImage.createMany({
          data: data.images.map((url: string) => ({
            propertyId: property.id,
            url,
          })),
        })
      }

      // Update address if provided
      if (data.address && existingProperty.address.length > 0) {
        await prisma.address.update({
          where: { id: existingProperty.address[0].id },
          data: {
            countryId: data.address.countryId,
            stateId: data.address.stateId,
            city: data.address.city,
            postalCode: data.address.postalCode,
            streetName: data.address.streetName,
            description: data.address.description,
          }
        })

        // Update positions if provided
        if (data.address.positions) {
          const addressId = existingProperty.address[0].id
          const positions = await prisma.positions.findFirst({
            where: { addressId }
          })

          if (positions) {
            await prisma.positions.update({
              where: { id: positions.id },
              data: {
                latitude: data.address.positions.latitude,
                longitude: data.address.positions.longitude
              }
            })
          } else {
            await prisma.positions.create({
              data: {
                addressId,
                latitude: data.address.positions.latitude,
                longitude: data.address.positions.longitude
              }
            })
          }
        }
      } else if (data.address) {
        // Create new address if it doesn't exist
        await prisma.address.create({
          data: {
            propertyId: property.id,
            countryId: data.address.countryId,
            stateId: data.address.stateId,
            city: data.address.city,
            postalCode: data.address.postalCode,
            streetName: data.address.streetName,
            description: data.address.description,
            positions: data.address.positions ? {
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

    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the property' },
      { status: 500 }
    )
  }
}

// DELETE a property by slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Find the property first
    const property = await prisma.property.findUnique({
      where: { slug },
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Delete the property (cascade will handle related entities)
    await prisma.property.delete({
      where: { slug },
    })

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the property' },
      { status: 500 }
    )
  }
}
