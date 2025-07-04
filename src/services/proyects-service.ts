import axios from 'axios'
import { API_ENDPOINTS } from '@/constants/api-endpoint'
import { ProjectUnit } from '@/types/projectUnit'
import { CreateProyectInput, Proyect } from '@/store/proyectStore'
import { Roadmap, Task } from '@/types/roadmap'

export const getAllProyects = async (): Promise<Proyect[]> => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROYECTS_INDEX)
    return response.data
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

export const createProyect = async (data: Partial<Proyect>) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PROYECT_CREATE, data)
    return response.data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const updateProyect = async (slug: string, data: CreateProyectInput) => {
  try {
    const response = await axios.put(API_ENDPOINTS.PROYECT_EDIT(slug), data)
    return response.data
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

export const deleteProyect = async (slug: string) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.PROYECT_DELETE(slug))
    return response.data
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// -------- UNIDADES --------

export const getProjectUnits = async (slug: string): Promise<ProjectUnit[]> => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROYECT_UNITS_INDEX(slug))
    return response.data
  } catch (error) {
    console.error('Error getting project unit:', error)
    throw error
  }
}

export const createProjectUnit = async (slug: string, data: Partial<ProjectUnit>): Promise<ProjectUnit> => {
  try {
    const response = await axios.post(API_ENDPOINTS.PROYECT_UNITS_CREATE(slug), data)
    return response.data
  } catch (error) {
    console.error('Error creating project unit:', error)
    throw error
  }
}

export const updateProjectUnit = async (
  slug: string,
  id: number,
  data: Partial<ProjectUnit>
): Promise<ProjectUnit> => {
  try {
    const response = await axios.put(API_ENDPOINTS.PROYECT_UNITS_UPDATE(slug, id), data)
    return response.data
  } catch (error) {
    console.error('Error updating project unit:', error)
    throw error
  }
}

export const deleteProjectUnit = async (slug: string, id: number): Promise<{ success: boolean }> => {
  try {
    const response = await axios.delete(API_ENDPOINTS.PROYECT_UNITS_DELETE(slug, id))
    return response.data
  } catch (error) {
    console.error('Error deleting project unit:', error)
    throw error
  }
}

// -------- ROADMAP --------

export const getProyectRoadmap = async (slug: string): Promise<Roadmap | null> => {
  try {
    const response = await axios.get(`/api/proyects/${slug}/roadmap`)
    return response.data
  } catch (error: any) {
    if (error.response && error.response.status === 404) return null
    throw error
  }
}

export const saveProyectRoadmap = async (slug: string, tasks: Task[]): Promise<Roadmap> => {
  const response = await axios.put(`/api/proyects/${slug}/roadmap`, { tasks })
  return response.data
}
