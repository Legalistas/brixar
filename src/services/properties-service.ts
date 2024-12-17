import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export const getAllProperties = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROPERTIES_INDEX)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const getPorpertiesBySlug = async (slug: string) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROPERTY_BY_SLUG(slug))
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}
