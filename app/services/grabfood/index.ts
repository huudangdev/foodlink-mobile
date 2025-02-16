// app/services/index.ts
import axios from "axios";
//import { loginGrabFood } from "../auth/authGrabfood";

//import { URL_DEVELOPMENT } from "@env";

const API_BASE_URL = "https://foodlink-api.onrender.com";

export const getGrabFoodOrders = async (
  startTime: string,
  endTime: string,
  pageIndex: number,
  pageSize: number,
  grabFoodToken: string | undefined,
  username: string | undefined
) => {
  try {
    const accessToken = grabFoodToken;

    const response = await axios.get(`${API_BASE_URL}/order-history`, {
      params: {
        startTime,
        endTime,
        pageIndex,
        pageSize,
        grabFoodToken,
        username,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching GrabFood orders:", error);
    throw error;
  }
};
