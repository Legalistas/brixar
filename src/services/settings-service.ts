import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export const getCountries = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.COUNTRIES_INDEX)
    return response.data
  } catch (error) {
    console.error('Error fetching countries:', error)
    throw error
  }
}

export const getStates = async (countryId: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.STATES_INDEX(countryId))
    return response.data
  } catch (error) {
    console.error('Error fetching states:', error)
    throw error
  }
}
