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
  PROPERTIES_INDEX: '/api/properties',
  PROPERTY_GET: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_UPDATE: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_DELETE: (slug: string) => `/api/properties/${slug}`,
  PROPERTY_CREATE: '/api/properties',

  // Proyects
  PROYECTS_INDEX: `${API_BASE_URL}/proyects`,
  PROYECT_CREATE: `${API_BASE_URL}/proyects`,
  PROYECT_BY_SLUG: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  PROYECT_EDIT: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  PROYECT_DELETE: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,

  // Unidades de un proyecto (ProjectUnit)
  PROYECT_UNITS_INDEX: (slug: string) =>
    `${API_BASE_URL}/proyects/${slug}/units`,
  PROYECT_UNITS_CREATE: (slug: string) =>
    `${API_BASE_URL}/proyects/${slug}/units`,
  PROYECT_UNITS_UPDATE: (slug: string, id: number) =>
    `${API_BASE_URL}/proyects/${slug}/units/${id}`,
  PROYECT_UNITS_DELETE: (slug: string, id: number) =>
    `${API_BASE_URL}/proyects/${slug}/units/${id}`,

  SCHEDULE_VISIT: `${API_BASE_URL}/visits/schedule`,
  VISITS_INDEX: `${API_BASE_URL}/visits/user`,
  CHECK_EXISTING_VISIT: (propertyId: number, userId: string) =>
    `${API_BASE_URL}/visits/check?propertyId=${propertyId}&userId=${userId}`,

  // Inquiries (Consultas)
  INQUIRIES_INDEX: '/api/inquiries',
  USER_INQUIRIES: '/api/inquiries/user',
  INQUIRY_CREATE: '/api/inquiries',
  INQUIRY_BY_ID: (id: number) => `/api/inquiries/${id}`,
  INQUIRY_UPDATE: (id: number) => `/api/inquiries/${id}`,
  INQUIRY_DELETE: (id: number) => `${API_BASE_URL}/inquiries/${id}`,

  // Inquiry Messages
  INQUIRY_MESSAGES: (inquiryId: number) =>
    `/api/inquiries/${inquiryId}/messages`,
  INQUIRY_MESSAGE_CREATE: (inquiryId: number) =>
    `/api/inquiries/${inquiryId}/messages`,

  // Offer acceptance endpoints
  INQUIRY_CLIENT_ACCEPT: (id: number) => `/api/inquiries/${id}/accept/client`,
  INQUIRY_ADMIN_ACCEPT: (id: number) => `/api/inquiries/${id}/accept/admin`,
  INQUIRY_COMPLETE_TRANSACTION: (id: number) =>
    `/api/inquiries/${id}/complete-transaction`,

  // Sales endpoints
  SALE_CREATE: `${API_BASE_URL}/sales`,
  SALES_INDEX: `${API_BASE_URL}/sales`,
  SALE_BY_ID: (id: number) => `/api/sales/${id}`,
  SALE_UPDATE: (id: number) => `/api/sales/${id}`,
  SALE_CONFIRM: (id: number) => `${API_BASE_URL}/sales/${id}/confirm`,
  SALE_CANCEL: (id: number) => `${API_BASE_URL}/sales/${id}/cancel`,
  SALE_PROCESS: (id: number) => `${API_BASE_URL}/sales/${id}/process`,
  SALE_COMPLETE: (id: number) => `${API_BASE_URL}/sales/${id}/complete`,

  // Rutas de ventas (sales)
  USER_SALES: '/api/sales/user',
  ADMIN_SALES: '/api/sales/admin',
  SALE_UPDATE_STATUS: (id: number) => `/api/sales/${id}/status`,
  SALE_ADD_TRANSACTION: (id: number) => `/api/sales/${id}/transactions`,

  // Proyect
  PROYECT_SHOW: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  PROYECTS_CREATE: `${API_BASE_URL}/proyects`,
  PROYECT_UPDATE: (slug: string) => `${API_BASE_URL}/proyects/${slug}`,
  // Costos de proyectos
  COSTS_INDEX: `${API_BASE_URL}/costs`,
  COSTS_CREATE: `${API_BASE_URL}/costs`,
  COSTS_BY_PROJECT_ID: (proyectId: number) =>
    `${API_BASE_URL}/costs?proyectId=${proyectId}`,
  COSTS_BY_PROJECT_SLUG: (slug: string) =>
    `${API_BASE_URL}/costs/proyecto/${slug}`,
  COST_BY_ID: (id: number) => `${API_BASE_URL}/costs/${id}`,
  COST_UPDATE: (id: number) => `${API_BASE_URL}/costs/${id}`,
  COST_DELETE: (id: number) => `${API_BASE_URL}/costs/${id}`,

  // Compensaciones entre inversores
  COMPENSATIONS_INDEX: `${API_BASE_URL}/compensations`,
  COMPENSATIONS_CREATE: `${API_BASE_URL}/compensations`,
  COMPENSATIONS_BY_PROJECT_ID: (proyectId: number) =>
    `${API_BASE_URL}/compensations?proyectId=${proyectId}`,
  COMPENSATIONS_BY_PROJECT_SLUG: (slug: string) =>
    `${API_BASE_URL}/compensations/proyecto/${slug}`,
  COMPENSATION_BY_ID: (id: number) => `${API_BASE_URL}/compensations/${id}`,
  COMPENSATION_UPDATE: (id: number) => `${API_BASE_URL}/compensations/${id}`,
  COMPENSATION_DELETE: (id: number) => `${API_BASE_URL}/compensations/${id}`,

  // Roadmap de proyecto
  PROYECT_ROADMAP_GET: (slug: string) =>
    `${API_BASE_URL}/proyects/${slug}/roadmap`,
  PROYECT_ROADMAP_SAVE: (slug: string) =>
    `${API_BASE_URL}/proyects/${slug}/roadmap`,
}
