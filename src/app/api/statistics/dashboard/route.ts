import { NextResponse } from 'next/server'
import { prisma } from '@/libs/prisma'
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
} from '@/utils/dateUtils'
import { Role } from '@prisma/client'

export async function GET() {
  try {
    // Basic counts
    const [userCount, productCount, stockValue, salesCount] = await Promise.all(
      [
        prisma.user.count().catch((e) => {
          console.error('Error counting users:', e)
          throw e
        }),
        prisma.products.count().catch((e) => {
          console.error('Error counting products:', e)
          throw e
        }),
        prisma.products.aggregate({ _sum: { price: true } }).catch((e) => {
          console.error('Error aggregating stock value:', e)
          throw e
        }),
        prisma.sale.count().catch((e) => {
          console.error('Error counting sales:', e)
          throw e
        }),
      ]
    )

    // Date Ranges for Sales Aggregation
    const date = new Date()
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    const [salesMonth, salesToday, salesWeek] = await Promise.all([
      prisma.sale
        .aggregate({
          _sum: { total: true },
          where: { date: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
        })
        .catch((e) => {
          console.error('Error aggregating monthly sales:', e)
          throw e
        }),
      prisma.sale
        .aggregate({
          _sum: { total: true },
          where: {
            date: {
              gte: getStartOfDay(date),
              lt: getEndOfDay(getStartOfDay(date)),
            },
          },
        })
        .catch((e) => {
          console.error('Error aggregating daily sales:', e)
          throw e
        }),
      prisma.sale
        .aggregate({
          _sum: { total: true },
          where: {
            date: {
              gte: getStartOfWeek(date),
              lt: getEndOfWeek(getStartOfWeek(date)),
            },
          },
        })
        .catch((e) => {
          console.error('Error aggregating weekly sales:', e)
          throw e
        }),
    ])

    // Low Stock Products
    const lowStock = await prisma.products
      .findMany({
        where: { qty: { lt: 2 } },
      })
      .catch((e) => {
        console.error('Error finding low stock products:', e)
        throw e
      })

    // Users and Top Buyers
    const users = await prisma.user
      .findMany({
        where: { role: Role.CUSTOMER },
        select: { id: true, name: true, email: true },
      })
      .catch((e) => {
        console.error('Error finding users:', e)
        throw e
      })

    const topBuyersPromises = users.map(async (user) => {
      try {
        const salesCount = await prisma.sale.count({
          where: { customerId: user.id },
        })
        return { ...user, salesCount }
      } catch (e) {
        console.error(`Error counting sales for user ${user.id}:`, e)
        return { ...user, salesCount: 0 }
      }
    })

    const topBuyers = await Promise.all(topBuyersPromises)

    const sortedTopBuyers = topBuyers
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10)

    // Top Selling Products
    const saleDetails = await prisma.saleDetail
      .findMany({
        include: { product: true },
      })
      .catch((e) => {
        console.error('Error finding sale details:', e)
        throw e
      })

    const productSales = saleDetails.reduce((acc, detail) => {
      const productId = detail.productId
      if (!acc[productId]) {
        acc[productId] = { product: detail.product, totalQty: 0 }
      }
      acc[productId].totalQty += detail.qty
      return acc
    }, {} as Record<string, { product: any; totalQty: number }>)

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 5)

    return NextResponse.json({
      users: userCount,
      customers: users.length,
      products: productCount,
      stockValue: stockValue._sum.price || 0,
      sales: salesCount,
      salesMonth: salesMonth._sum.total || 0,
      salesToday: salesToday._sum.total || 0,
      salesWeek: salesWeek._sum.total || 0,
      lowStock,
      topProducts,
      sortedTopBuyers,
    })
  } catch (error) {
    console.error('Error in StatisticsController.index:', error)
    return NextResponse.json(
      { message: 'Server Error', error: (error as Error).message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
