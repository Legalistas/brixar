import slugifyLib from 'slugify';

/**
 * Convierte un texto en un slug URL-friendly
 * @param text Texto a convertir en slug
 * @returns String formateado como slug
 */
export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,      // convertir a minúsculas
    strict: true,     // eliminar caracteres especiales
    locale: 'es'      // considerar caracteres españoles
  });
}