// import { useAuth } from "@/app/context/AuthContext";
// import axios from "axios";

// //import { URL_DEVELOPMENT } from "@env";

// const API_BASE_URL = "https://foodlink-api.onrender.com";

// const API_URL = "https://merchant.grab.com/mex-core-api/user-profile/v1/login";

// interface LoginRequest {
//   username: string;
//   password: string;
//   without_force_logout: boolean;
//   login_source: string;
//   session_data: {
//     web_session_data: {
//       user_agent: string;
//       human_readable_user_agent: string;
//     };
//   };
// }

// interface LoginResponse {
//   success(arg0: string, success: any): unknown;
//   data: {
//     jwt: any;
//     success: boolean;
//     code: number;
//     data: {
//       jwt: string;
//       // other fields...
//     };
//     // other fields...
//   };
//   error: any;
// }

// export const loginGrabFood = async (
//   username: string,
//   password: string,
//   user: any
// ): Promise<LoginResponse> => {
//   const loginRequest: LoginRequest = {
//     username,
//     password,
//     without_force_logout: false,
//     login_source: "TROY_PORTAL_MAIN_USERNAME_PASSWORD",
//     session_data: {
//       web_session_data: {
//         user_agent:
//           "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
//         human_readable_user_agent: "Chrome",
//       },
//     },
//   };

//   try {
//     const response = await axios.post<LoginResponse>(API_URL, loginRequest);

//     console.log("GrabFood login response:", response.data.data.success);

//     if (response.data.data.success !== true) {
//       throw new Error("Invalid response from GrabFood API");
//     }

//     if (!response.data.data.data.jwt) {
//       throw new Error("Invalid response from GrabFood API");
//     }

//     console.log("GrabFood JWT:", response.data.data.data.jwt);
//     console.log("username: ", user.username);

//     await axios.post(`${API_BASE_URL}/auth/login-grabfood`, {
//       grabFoodToken: response.data.data.data.jwt,
//       username: user.username,
//       //grabFoodTokenExpiration: ,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error logging in to GrabFood:", error);
//     throw error;
//   }
// };

import axios from "axios";

const API_BASE_URL = "https://foodlink-api.onrender.com";
const API_URL = "https://api.grab.com/mex-app/troy/user-profile/v1/login";

interface LoginRequest {
  username: string;
  password: string;
  without_force_logout: boolean;
  login_source: string;
  session_data: {
    mobile_session_data: {
      device_id: string;
      device_brand: string;
      device_model: string;
    };
  };
}

interface LoginResponse {
  data: {
    success: boolean;
    //jwt: string;
    data: {
      jwt: string;
    };
  };
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
    login_source: "TROY_APP_MAIN_USERNAME_PASSWORD",
    session_data: {
      mobile_session_data: {
        device_id:
          "ad3ac5d9b3b770295216260471b3114104bf91739ea3bf8201e6524068b11c92",
        device_brand: "apple",
        device_model: "iPhone",
      },
    },
  };

  try {
    const response = await axios.post<LoginResponse>(API_URL, loginRequest);

    if (!response.data.data.success) {
      throw new Error("Invalid response from GrabFood API");
    }

    //console.log("token jwt grabfood: ", response.data.data.data.jwt);

    const saved = await axios.post(`${API_BASE_URL}/auth/login-grabfood`, {
      grabFoodToken: response.data.data.data.jwt,
      username: user.username,
    });

    //console.log("GrabFood login response:", saved.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      }
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

const example = {
  data: {
    attemptsLeft: 0,
    block_minutes: 0,
    block_time: null,
    code: 200,
    data: {
      analytics_id: "",
      business_line_ids: [Array],
      city_id: 14,
      config: null,
      consent: [Object],
      country: "VN",
      enable_tc: false,
      jwt: "eyJhbGciOiJSUzI1NiIsImtpZCI6Il9kZWZhdWx0IiwidHlwIjoiSldUIn0.eyJhdWQiOiJNRVhVU0VSUyIsImVzaSI6InlTaTJnQTZGQnhxWjlkWlFrSDJnaFpHQ3ppb1NKWkFIOC90M3lXdHY3YjNnNDdIWDFkb2NaeGp6YkxXQ2lBPT0iLCJleHAiOjIyNzkxODE0NzksImlhdCI6MTczOTE4MTQ3NiwianRpIjoiYTRhOTdjZTktY2NlMS00NzMxLWFiMTEtYzc2MDNmYjM5N2Q1IiwibG1lIjoiTkFUSVZFIiwibmFtZSI6IiIsInN1YiI6IjdjNTFjMmUwLTQ3MzQtNDY0MS05MTdhLTU2NjYzMjBiZTMzNyJ9.sF-w-nVY9ovYHcqkxwbc7nCpC6AO_bJGXD-Ywv7bLgzf0h9vJ7dK3KzyZaTevYIKE3M7UcAIxu-MOm1Y1t_RoSYz4_QAea342GYIAv0C6NPIenBXwEhk2vfp4-JdaiRfhQKMwQiwXF9ocnXRkVUA8Ify6GNxLw4lMJJ0dFhjpulPgIOOlf8Eiin6BqasL2zwpjuNuqk4tzYSNe6kSHzz6IytC0cYMJGJXUEK7gX2_byFP0fJwb2z2Ln9mhxCpT8zpqhyuF3sQ6f92En1sIig91_s1YNeu6KFbWbPRDBvtScAAf2fXZevnXVuZ8Jgppruxlw2bQldm8turqpZr6jfPQ",
      merchant_grab_id: "d4d600a4-0465-4a9c-81be-679caa72396c",
      regd_country_id: 704,
      user_profile: [Object],
      user_profile_id: "992141994948259079",
      user_type: 5,
    },
    request_id: "",
    success: true,
  },
  error: null,
};
