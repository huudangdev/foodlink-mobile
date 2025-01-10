import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

const API_URL = "https://merchant.grab.com/mex-core-api/user-profile/v1/login";

interface LoginRequest {
  username: string;
  password: string;
  without_force_logout: boolean;
  login_source: string;
  session_data: {
    web_session_data: {
      user_agent: string;
      human_readable_user_agent: string;
    };
  };
}

interface LoginResponse {
  success(arg0: string, success: any): unknown;
  data: {
    jwt: any;
    success: boolean;
    code: number;
    data: {
      jwt: string;
      // other fields...
    };
    // other fields...
  };
  error: any;
}

export const loginGrabFood = async (
  username: string,
  password: string,
  user: any
): Promise<LoginResponse> => {
  const loginRequest: LoginRequest = {
    username,
    password,
    without_force_logout: false,
    login_source: "TROY_PORTAL_MAIN_USERNAME_PASSWORD",
    session_data: {
      web_session_data: {
        user_agent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        human_readable_user_agent: "Chrome",
      },
    },
  };

  try {
    const response = await axios.post<LoginResponse>(API_URL, loginRequest);

    console.log("GrabFood login response:", response.data.data.success);
    console.log(
      "Logging in to GrabFood with token:",
      response.data.data.data.jwt
    );

    if (response.data.data.success !== true) {
      throw new Error("Invalid response from GrabFood API");
    }

    if (!response.data.data.data.jwt) {
      throw new Error("Invalid response from GrabFood API");
    }

    await axios.post("http://localhost:3000/auth/login-grabfood", {
      grabFoodToken: response.data.data.data.jwt,
      username: user.username,
      //grabFoodTokenExpiration: ,
    });

    return response.data;
  } catch (error) {
    console.error("Error logging in to GrabFood:", error);
    throw error;
  }
};
