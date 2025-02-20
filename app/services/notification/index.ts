// app/services/index.ts
import axios from "axios";

const API_BASE_URL = "http://52.77.222.212";

export const saveTokenExpoNoti = async (token: string, username: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/token-notification`,
      {
        token,
        username,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving Expo push token:", error);
    throw error;
  }
};

