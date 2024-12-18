import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export const scheduleVisit = async (
  propertySlug: string,
  visitDate: string,
  userId: string
) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SCHEDULE_VISIT, {
      propertySlug,
      visitDate,
      userId,
    })
    return response.data
  } catch (error) {
    console.error('Error scheduling visit:', error)
    throw error
  }
}

export const checkExistingVisit = async (
  propertyId: number,
  userId: string
) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.CHECK_EXISTING_VISIT(propertyId, userId)
    )
    return response.data
  } catch (error) {
    console.error('Error checking existing visit:', error)
    throw error
  }
}

export const getAllVisits = async (id: number) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.VISITS_INDEX}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching visits:', error)
    throw error
  }
}
