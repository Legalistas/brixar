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
  PROPERTIES_INDEX: "/api/properties",
  PROPERTY_GET: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_UPDATE: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_DELETE: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_CREATE: "/api/properties",
  
  // Proyects
  PROYECTS_INDEX: `${API_BASE_URL}/proyects`,
  PROYECT_CREATE: `${API_BASE_URL}/proyects`,
  PROYECT_BY_SLUG: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  PROYECT_EDIT: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  PROYECT_DELETE: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,

  SCHEDULE_VISIT: `${API_BASE_URL}/visits/schedule`,
  VISITS_INDEX: `${API_BASE_URL}/visits/user`,
  CHECK_EXISTING_VISIT: (propertyId: number, userId: string) =>
    `${API_BASE_URL}/visits/check?propertyId=${propertyId}&userId=${userId}`,

  // Inquiries (Consultas)
  INQUIRIES_INDEX: `${API_BASE_URL}/inquiries`,
  INQUIRY_CREATE: `${API_BASE_URL}/inquiries`,
  INQUIRY_BY_ID: (id: number) => `${API_BASE_URL}/inquiries/${id}`,
  INQUIRY_UPDATE: (id: number) => `${API_BASE_URL}/inquiries/${id}`,
  INQUIRY_DELETE: (id: number) => `${API_BASE_URL}/inquiries/${id}`,
  
  // Inquiry Messages
  INQUIRY_MESSAGES: (inquiryId: number) => `${API_BASE_URL}/inquiries/${inquiryId}/messages`,
  INQUIRY_MESSAGE_CREATE: (inquiryId: number) => `${API_BASE_URL}/inquiries/${inquiryId}/messages`,
  
  // User Inquiries
  USER_INQUIRIES: `${API_BASE_URL}/inquiries/user`,
  PROPERTY_INQUIRIES: (propertyId: number) => `${API_BASE_URL}/inquiries/property/${propertyId}`,
}
