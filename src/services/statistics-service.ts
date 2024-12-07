import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoint";

export const getStatisticsDashboard = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.STATISTICS_DASHBOARD);
    return response.data; // Handle the response data from the Next.js API route
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error; // Rethrow or handle error as needed
  }
};
