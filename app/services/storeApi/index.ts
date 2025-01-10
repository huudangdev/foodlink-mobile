// app/services/storeApi.ts
import axios from "axios";

const STORE_API_URL =
  "https://api.grab.com/mex-app/troy/user-profile/v1/unified-profile?isBalanceNeeded=false";

export const getStoreInfo = async (token: string) => {
  if (!token) {
    token =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6Il9kZWZhdWx0IiwidHlwIjoiSldUIn0.eyJhdWQiOiJNRVhVU0VSUyIsImVzaSI6Ijg0UVh2YzlIa0VINHMyaDV4YXljTVY4MWthSFdJT1J4aXl3ZVI4dDZxUlpNM1JXN3FYbzlCYURYdGs2NkJRPT0iLCJleHAiOjIyNzY0Mjc0MTgsImlhdCI6MTczNjQyNzQxNSwianRpIjoiYjZjZmQxZTQtMWUwNC00NmUwLWFkZDctNDNlMmZkMzNjODNhIiwibG1lIjoiTkFUSVZFIiwibmFtZSI6IiIsInN1YiI6Ijg0Y2NmYjI0LWIwMWUtNDY1ZC04ODk2LWEzZDgyOTBjOGQ5OSJ9.LCdPhTX_TdUrywpHojmziMjICV2VnI72fOHCnH-YQLhMs9HBe8X_p9eWDQtSK-Do_E_d3z3-M92HGRuT76u2wLyAAWmWV2YZj5is-ilUjsuSDtrNBGG9exRDVbxOEoVpGCamHaszx7hhhBqDiD6W898EN7BaUdS3ASF6wt8pcMWVKNO7z1BXfwQ89uyufM4ykyiyQO8eanY3Z5mIgL4-ax_KnkC4c9jsYIsTeY1AmxIrEx-IJvueavuJOh-0_nmpFplEvSEBlPOeaCO-dNIh1xp3plakcvPnEWekhxy7djI7zhrbZm0uY2TqCazNLHMDR0wpQgxbZF_bvMzEHv5OHg";
  }
  console.log("Token:", token);
  try {
    const response = await axios.get(STORE_API_URL, {
      headers: {
        Host: "api.grab.com",
        "NetworkKit-disable-gzip": "true",
        "User-Agent": "Grab Merchant/4.118.0 (ios 18.1.1; Build 92050179)",
        "X-Platform-Type": "ios",
        "x-device-id":
          "651158bc6e1d1a9d5e0932f6a639f21736cdc07804fa8fb6f0022f10ecc42532",
        "X-Client-ID": "grabfood",
        Connection: "keep-alive",
        "x-mts-ssid": token,
        "X-Currency": "VND",
        "x-agent": "mexapp",
        Authorization: `${token}`,
        "Accept-Language": "vi_US",
        "X-Request-ID": "35EB728C-DB45-4081-B6FE-14D427E509C0",
        "x-grab-id-audience": "FOODMAX",
        Accept: "application/json",
        "mex-country": "VN",
        "x-user-type": "user-profile",
        "x-grabkit-clientid": "GrabMerchant-App",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching store info:", error);
    throw error;
  }
};
