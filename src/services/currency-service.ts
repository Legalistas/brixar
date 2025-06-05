import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'

export async function getAllCurrencies() {
  try {
    const response = await axios.get(API_ENDPOINTS.CURRENCIES_INDEX)
    return response.data
  } catch (error) {
    console.error('Error fetching currencies:', error)
    throw error
  }
}

export async function getDollarRate() {
  try {
    const response = await axios.get(`${API_ENDPOINTS.CURRENCIES_INDEX}/usd`)
    return response.data
  } catch (error) {
    console.error('Error fetching USD rate:', error)
    throw error
  }
}

export async function updateDollarFromAPI() {
  try {
    const response = await axios.post(`${API_ENDPOINTS.CURRENCIES_INDEX}/update-dollar`)
    return response.data
  } catch (error) {
    console.error('Error updating dollar from API:', error)
    throw error
  }
}

export async function updateCurrencyRate(code: string, rate: number) {
  console.log(`Updating currency rate for ${code} to ${rate}`)

  try {
    const response = await axios.post(API_ENDPOINTS.CURRENCIES_INDEX, {
      code: "ars",
      rate,
    })
    return response.data
  } catch (error) {
    console.error('Error updating currency rate:', error)
    throw error
  }
}

export async function fetchAndUpdateRates() {
  try {
    const response = await axios.put(API_ENDPOINTS.CURRENCIES_INDEX)
    return response.data
  } catch (error) {
    console.error('Error fetching and updating rates:', error)
    throw error
  }
}
