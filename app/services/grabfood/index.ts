// app/services/index.ts
import axios from "axios";
//import { loginGrabFood } from "../auth/authGrabfood";

const GRABFOOD_API_BASE_URL = "http://localhost:3000";

export const getGrabFoodOrders = async (
  startTime: string,
  endTime: string,
  pageIndex: number,
  pageSize: number,
  grabFoodToken: string | undefined
) => {
  try {
    // Xác thực và lấy token
    //const accessToken = await loginGrabFood(username, password);
    const accessToken = grabFoodToken;
    console.log("GrabFood access token on getGrabFoodOrders:", accessToken);
    // Lấy danh sách order
    const response = await axios.get(`${GRABFOOD_API_BASE_URL}/order-history`, {
      params: {
        startTime,
        endTime,
        pageIndex,
        pageSize,
        grabFoodToken,
      },
      // headers: {
      //   Authorization: `${accessToken}`,
      // },
    });
    console.log("GrabFood orders:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching GrabFood orders:", error);
    throw error;
  }
};
