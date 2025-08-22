// src/services/allAPI.js
import axiosInstance from "./commonAPI";

// =============== SALES ENTRY APIs ===============
export const createSalesEntry = async (data) => {
  try {
    const response = await axiosInstance.post("/header/multiple", data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      JSON.stringify(error.response?.data) ||
      error.message;
    console.error("Failed to create sales entry:", message);
    throw error;
  }
};

export const getSalesEntries = async () => {
  try {
    const response = await axiosInstance.get("/header/multiple");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sales entries:", error.response?.data || error.message);
    throw error;
  }
};
