export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL_WP || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  STATISTICS_DASHBOARD: `${API_BASE_URL}/statistics/dashboard`,

  CUSTOMERS_INDEX: `${API_BASE_URL}/customers`,
  CUSTOMER_CREATE: `${API_BASE_URL}/customers`,
  CUSTOMER_VIEW: (id: number) => `${API_BASE_URL}/customers/${id}`,
  CUSTOMER_EDIT: (id: number) => `${API_BASE_URL}/customers/${id}`,
  CUSTOMER_DELETE: (id: number) => `${API_BASE_URL}/customers/${id}`,

  USERS_INDEX: `${API_BASE_URL}/users`,
  USER_CREATE: `${API_BASE_URL}/users`,
  USER_VIEW: (id: number) => `${API_BASE_URL}/users/${id}`,
  USER_EDIT: (id: number) => `${API_BASE_URL}/users/${id}`,
  USER_DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,

  // New endpoints for settings
  CURRENCIES_INDEX: `${API_BASE_URL}/currencies`,
  COUNTRIES_INDEX: `${API_BASE_URL}/settings/countries`,
  STATES_INDEX: (countryId: number) =>
    `${API_BASE_URL}/settings/states/${countryId}`,

  // ENDPOINTS
  PROPERTIES_INDEX: `${API_BASE_URL}/properties`,
  PROPERTY_BY_SLUG: (slug: string) => `${API_BASE_URL}/properties/${slug}`,

  // Proyects
  PROYECTS_INDEX: `${API_BASE_URL}/proyects`,

  SCHEDULE_VISIT: `${API_BASE_URL}/visits/schedule`,
  VISITS_INDEX: `${API_BASE_URL}/visits/user`,
  CHECK_EXISTING_VISIT: (propertyId: number, userId: string) =>
    `${API_BASE_URL}/visits/check?propertyId=${propertyId}&userId=${userId}`,
}
