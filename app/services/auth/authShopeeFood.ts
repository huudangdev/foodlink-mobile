import axios from "axios";
import { Alert } from "react-native";

export const saveShopeeFoodToken = async (
  shopeeFoodToken: string,
  username: string
) => {
  console.log("Saving ShopeeFood token:", shopeeFoodToken, username);
  try {
    const response = await axios.post(
      "http://52.77.222.212/auth/login-shopeefood",
      {
        shopeeFoodToken,
        shopeeFoodTokenExpiration: new Date(Date.now() + 3600 * 100000 * 10), // Giả sử token có thời hạn 10 giờ
        username,
      }
    );
    //Alert.alert("Success", "ShopeeFood token saved successfully");
    console.log("API response:", response.data);
  } catch (error) {
    console.error("Error saving ShopeeFood token:", error);
    //Alert.alert("Error", "Failed to save ShopeeFood token");
  }
};
