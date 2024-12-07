import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.CUSTOMERS_INDEX)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const getCustomer = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.CUSTOMER_VIEW(id))
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export const createCustomer = async (data: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.CUSTOMER_CREATE, data)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}

export async function updateCustomer(id: number, data: any) {
  try {
    const response = await axios.put(API_ENDPOINTS.CUSTOMER_EDIT(id), data)
    return response.data // Handle the response data from the Next.js API route
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error // Rethrow or handle error as needed
  }
}
