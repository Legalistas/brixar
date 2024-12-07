import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.USERS_INDEX);
    return response.data; // Handle the response data from the Next.js API route
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error; // Rethrow or handle error as needed
  }
};

export const getUser = async (id: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS.USER_VIEW(id));
    return response.data; // Handle the response data from the Next.js API route
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error; // Rethrow or handle error as needed
  }
};

export const createUser = async (data: any) => {
  try {
    const response = await axios.post(API_ENDPOINTS.USER_CREATE, data);
    return response.data; // Handle the response data from the Next.js API route
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error; // Rethrow or handle error as needed
  }
};

export const updateUser = async (data: any, id: number) => {
  try {
    const response = await axios.put(API_ENDPOINTS.USER_EDIT(id), data);
    return response.data; // Handle the response data from the Next.js API route
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error; // Rethrow or handle error as needed
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(API_ENDPOINTS.USER_DELETE(id));
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
