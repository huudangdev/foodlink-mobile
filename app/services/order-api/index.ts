// app/services/orderApi.ts
import axios from "axios";
//import { URL_DEVELOPMENT } from "@env";

const API_BASE_URL = "https://foodlink-api.onrender.com";

export const getOrderDetails = async (
  orderID: string,
  token: string
  //merchantId: string
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/order-details/${orderID}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
