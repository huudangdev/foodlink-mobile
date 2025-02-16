// app/services/authApi.ts
import axios from "axios";
//import { URL_DEVELOPMENT } from "@env";

const API_BASE_URL = "https://foodlink-api.onrender.com";

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
