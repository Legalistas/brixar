import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { Proyect } from '@/types/proyect'

export const getAllProyects = async (): Promise<Proyect[]> => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROYECTS_INDEX)
    return response.data // Axios automatically parses JSON and puts the data in .data
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

export const getProyectBySlug = async (slug: string): Promise<Proyect> => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PROYECTS_INDEX}/${slug}`)
    return response.data
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}
