// app/services/authApi.ts
import axios from "axios";
//import { URL_DEVELOPMENT } from "@env";

const API_BASE_URL = "http://52.77.222.212";

export const login = async (username: string, password: string) => {
  try {
    console.log('Login:', username, password)
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
