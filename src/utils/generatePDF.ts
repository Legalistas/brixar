import jsPDF from 'jspdf'
import {
  formatCurrency,
  numeroALetras,
  formatDocumentType,
} from './formatUtils'
import { Sale, PDFData } from '@/types/pdf'

export const generatePDF = (saleData: any): PDFData => {
  const sale: Sale = saleData || {}

  const doc = new jsPDF('p', 'pt', 'a4')

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 40
  const contentWidth = pageWidth - 2 * marginX
  const startX = marginX
  const startY = 40
  const lineHeight = 15
  const productDescriptionWidth = 280 // Ancho máximo para la descripción

  const roundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void => {
    doc.roundedRect(x, y, w, h, r, r)
  }

  // Función para dividir texto en líneas
  const splitTextToLines = (text: string, maxWidth: number): string[] => {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width =
        doc.getStringUnitWidth(`${currentLine} ${word}`) * doc.getFontSize()

      if (width < maxWidth) {
        currentLine += ` ${word}`
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines.slice(0, 2) // Limitamos a 2 líneas
  }

  try {
    doc.addImage('/assets/logo.png', 'PNG', startX, startY, 180, 50)
  } catch (error) {
    console.error('Error loading company logo:', error)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('Company Name', startX, startY + 30)
  }

  roundedRect(pageWidth - 200, startY, 160, 50, 5)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  const receiptsText = sale.receipts ? `${sale.receipts}` : 'N/A'
  doc.text(receiptsText, pageWidth - 190, startY + 20)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    `FECHA ${new Date(sale.date || new Date()).toLocaleDateString()}`,
    pageWidth - 190,
    startY + 35
  )

  const clientStartY = startY + 100
  roundedRect(startX, clientStartY, contentWidth, 80, 5)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE', startX + 10, clientStartY + 20)

  const customer = sale.customer || {}

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`${customer.name || 'N/A'}`, startX + 10, clientStartY + 35)
  doc.text(`Dirección: No disponible`, startX + 10, clientStartY + 50)
  doc.text(`Documento: No disponible`, startX + 10, clientStartY + 65)
  doc.text(
    `Correo electrónico: ${customer.email || 'N/A'}`,
    startX + 200,
    clientStartY + 50
  )
  doc.text(`Teléfono: No disponible`, startX + 200, clientStartY + 65)

  const tableStartY = clientStartY + 100
  roundedRect(
    startX,
    tableStartY,
    contentWidth,
    pageHeight - tableStartY - 150,
    5
  )

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('CODIGO', startX + 10, tableStartY + 15)
  doc.text('DESCRIPCION', startX + 80, tableStartY + 15)
  doc.text('CANTIDAD', startX + 200, tableStartY + 15)
  doc.text('P.U.', startX + 300, tableStartY + 15)
  doc.text('DSCTO', startX + 380, tableStartY + 15)
  doc.text('SUBTOTAL', startX + 460, tableStartY + 15)

  let yPosition = tableStartY + 40
  let totalAmount = 0

  const saleDetail = sale.saleDetail || []
  saleDetail.forEach((item: any) => {
    const product = item.product || {}
    const productCode = (product.sku && product.sku.toString()) || 'N/A'
    const productName =
      (product.name && product.name.toString()) || 'Producto no disponible'
    const productQty = (item.qty || 0).toString()
    const productPrice = formatCurrency(item.price || 0)
    const productDiscount = '0.00'
    const productSubtotal = formatCurrency(item.total || 0)

    // Dividir el nombre del producto en dos líneas si es necesario
    const productNameLines = splitTextToLines(
      productName,
      productDescriptionWidth
    )

    doc.setFont('helvetica', 'normal')
    doc.text(productCode, startX + 10, yPosition)

    // Escribir cada línea del nombre del producto
    productNameLines.forEach((line, index) => {
      doc.text(line, startX + 80, yPosition + index * (lineHeight - 5))
    })

    doc.text(productQty, startX + 200, yPosition)
    doc.text(productPrice.toString(), startX + 300, yPosition)
    doc.text(productDiscount, startX + 380, yPosition)
    doc.text(productSubtotal.toString(), startX + 460, yPosition)

    totalAmount += parseFloat((item.total || 0).toString())
    yPosition += lineHeight * (productNameLines.length > 1 ? 2 : 1) // Ajustar el espaciado según el número de líneas
  })

  // Función para obtener el texto del total con el formato de moneda correspondiente
  const getTotalText = (sale: any): string => {
    const total = sale.total
    const paymentType = sale.paymentMethod
    const amountDolar = sale.amountPaidDollar
    const amountArs = sale.amountPaidArs
    const amountGuaranies = sale.amountPaidGuaranies
    const amountPercent = sale.amountPercent

    const totalText = `${formatCurrency(total)}`
    let detailText = ''

    if (paymentType === 1) {
      detailText = ` (USD ${formatCurrency(amountDolar)})`
    } else if (paymentType === 2) {
      detailText = ` (USD ${formatCurrency(amountDolar)} + ARS ${formatCurrency(
        amountArs,
        'es-AR'
      )})`
    } else if (paymentType === 3) {
      detailText = ` (USD ${formatCurrency(amountDolar)} + ${amountPercent}%)`
    } else if (paymentType === 4) {
      detailText = ` (ARS ${formatCurrency(amountArs, 'es-AR')})`
    } else if (paymentType === 5) {
      detailText = ` (PYG ${formatCurrency(amountGuaranies, 'es-PY')})`
    }

    return `${totalText}${detailText}`
  }

  // Totals section with multi-currency support
  roundedRect(startX, pageHeight - 100, contentWidth, 60, 5)
  doc.setFont('helvetica', 'normal')
  doc.text('SUBTOTAL', startX + 350, pageHeight - 80)
  doc.text('IVA 0.00 %', startX + 350, pageHeight - 65)
  doc.text('TOTAL A PAGAR', startX + 350, pageHeight - 50)

  doc.setFont('helvetica', 'bold')
  const totalText = getTotalText(sale)

  // Dividir el texto del total en múltiples líneas si es necesario
  const totalWidth = 150 // Ancho máximo para el total
  const totalLines = doc.splitTextToSize(totalText, totalWidth)

  // Ajustar la posición vertical según el número de líneas
  totalLines.forEach((line: string, index: number) => {
    doc.text(line, startX + 440, pageHeight - 50 + index * lineHeight)
  })

  // Total en letras
  roundedRect(startX, pageHeight - 140, contentWidth, 30, 5)
  doc.setFontSize(9)
  doc.text('Total en letras:', startX + 10, pageHeight - 120)
  doc.setFont('helvetica', 'bold')
  doc.text(numeroALetras(parseFloat(sale.total)), startX + 80, pageHeight - 120)

  const fileName = `factura-${sale.receipts || 'sin-numero'}.pdf`
  doc.save(fileName)

  return {
    sales: [sale],
    x: startX,
    y: startY,
    w: contentWidth,
    h: pageHeight - startY - 150,
    r: 5,
  }
}
