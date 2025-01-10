// app/services/authApi.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Thay thế bằng URL API của bạn

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
