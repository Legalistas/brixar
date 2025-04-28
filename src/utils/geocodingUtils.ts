// Utilidad para obtener coordenadas geográficas a partir de una dirección
// Utilizando la API de Geocodificación de Google Maps

/**
 * Obtiene las coordenadas de latitud y longitud para una dirección
 * @param street - Nombre de la calle y número
 * @param city - Ciudad
 * @param state - Provincia/Estado
 * @param country - País
 * @param postalCode - Código postal (opcional)
 * @returns Promise con un objeto que contiene latitud y longitud, o null si no se encontró
 */
export const geocodeAddress = async (
  street: string,
  city: string,
  state: string,
  country: string,
  postalCode?: string
): Promise<{ latitude: string; longitude: string } | null> => {
  try {
    // Construir la dirección completa para la búsqueda
    const address = [
      street,
      city,
      state,
      country,
      postalCode
    ].filter(Boolean).join(', ');

    // Codificar la dirección para la URL
    const encodedAddress = encodeURIComponent(address);
    
    // Llamar a la API interna para geocodificación
    // (Esto asume que tienes un endpoint API interno para manejar las claves de API de Google)
    const response = await fetch(`/api/geocode?address=${encodedAddress}`);
    
    if (!response.ok) {
      throw new Error('Error al geocodificar dirección');
    }
    
    const data = await response.json();
    
    // Si la API devuelve resultados
    if (data.success && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat.toString(),
        longitude: location.lng.toString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error de geocodificación:', error);
    return null;
  }
};