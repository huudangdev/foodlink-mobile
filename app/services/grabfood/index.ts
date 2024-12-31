// app/services/grabfoodApi.ts
import axios from "axios";

const GRABFOOD_API_BASE_URL = "https://partner-api.grab.com/food"; // Thay thế bằng URL API của GrabFood

// Hàm để lấy token xác thực
export const authenticateGrabFood = async (
  clientId: string,
  clientSecret: string
) => {
  try {
    const response = await axios.post(`${GRABFOOD_API_BASE_URL}/oauth2/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });
    console.log("GrabFood authentication response:", response.data);
    return response.data.access_token;
  } catch (error) {
    console.error("Error authenticating with GrabFood:", error);
    throw error;
  }
};

// Hàm để lấy đơn hàng
export const getGrabFoodOrders = async (accessToken: string) => {
  try {
    const response = await axios.get(`${GRABFOOD_API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GrabFood orders:", error);
    throw error;
  }
};
