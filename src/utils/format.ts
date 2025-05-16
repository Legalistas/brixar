/**
 * Formatea un número como moneda
 * @param amount - El monto a formatear
 * @param currency - El código de moneda (por defecto 'USD')
 * @param locale - El locale para el formato (por defecto 'es-AR')
 * @returns Cadena formateada como moneda
 */
export function formatCurrency(
  amount?: number | string | null,
  currency = 'USD',
  locale = 'es-AR'
): string {
  if (amount === undefined || amount === null) return '$0,00'
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numericAmount)
}

/**
 * Formatea una fecha como cadena legible
 * @param date - La fecha a formatear
 * @param format - El formato deseado (por defecto 'DD/MM/YYYY')
 * @returns Cadena de fecha formateada
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formatea número como porcentaje
 * @param value - El valor a formatear como porcentaje
 * @param decimals - Número de decimales a mostrar
 * @returns Cadena formateada como porcentaje
 */
export function formatPercent(
  value?: number | string | null,
  decimals = 2
): string {
  if (value === undefined || value === null) return '0%'
  
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  
  return `${numericValue.toFixed(decimals)}%`
}
