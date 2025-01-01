// app/services/authApi.ts
import axios from "axios";

const API_BASE_URL = "https://api.example.com"; // Thay thế bằng URL API của bạn

export const login = async (phone: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
