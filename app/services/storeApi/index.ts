import axios from "axios";

const STORE_API_URL =
  "https://merchant.grab.com/troy/v1/merchant/?merchant_group_id=VNMG202008280942581159036&isBalanceNeeded=false&currency=VND";

export const getStoreInfo = async (token: string) => {
  if (!token) {
    token =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6Il9kZWZhdWx0IiwidHlwIjoiSldUIn0.eyJhdWQiOiJNRVhVU0VSUyIsImVzaSI6Ikoxa0MwVnBjS1A2dkJ5N1hwd1B2WlQzdUFEa1lacUtNR3BvQ0NDd1gwKzh5eFBXTEFZeSt3cjZUR3Z4ekFBPT0iLCJleHAiOjIyNzY0OTIxODEsImlhdCI6MTczNjQ5MjE3OCwianRpIjoiMjZmNjRlZTItZmY0ZS00YTMxLWFhODAtOGJjOTc4ZmYzNGNlIiwibG1lIjoiTkFUSVZFIiwibmFtZSI6IiIsInN1YiI6Ijg0Y2NmYjI0LWIwMWUtNDY1ZC04ODk2LWEzZDgyOTBjOGQ5OSJ9.fBiqMNa3-qKsUWmnyxahRjq5jj-s64Ejwinu8FazDIiMIVY038ICGaQK3LX1C9AZW3h5-SF7HotEJ2ku3d_NMAZC2M19WfmLyuTdwe_SQpCGWOmMU6mZudsFFWH2xkPZT0hbG6CP8gSKm1sq-PdaySqiU4Kna8zwD2VbGehFlZKSTC3cjywcE_dSRFx9khP0oWFXRPV6uW-USuzCfHTqHckVKk8ykDFUw5CCwo5WnH4wdxy0Sz0wIrXacmuluZKTG5XFo7jpFvs_02Pqjwr3pNi9qrfUEHZgPLS38gkc-HLNegpOcFqpCGY76lclr8LUHIRCSxBU84gl4b2-gg7R-g";
  }

  try {
    const response = await axios.get(STORE_API_URL, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,vi;q=0.8",
        authorization: token,
        "content-type": "application/json",
        cookie:
          "_gsvid=6b134d82-227c-484c-bdf6-28f6bc858337; geo_city=EMPTY; hwuuidtime=1735650605; hwuuid=6016f8ea-6abe-44af-884b-a0e58d59f0dd; geo_country=EMPTY; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Jan+03+2025+15%3A04%3A45+GMT%2B0700+(Indochina+Time)&version=202304.1.0&browserGpcFlag=1&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0003%3A1%2CC0004%3A1&geolocation=VN%3B40&AwaitingReconsent=false; OptanonAlertBoxClosed=2025-01-03T08:04:45.576Z; AWSELB=53B7490F14CB44B3C3CAE476A7D8BD7A112F66C8F807333E5C78FD4109F65AFEAFB0F879844BA5674BE47D52B41AEDC0C91AC16DC138FD2B53C4DF2AEF16B80681B7D92F02; AWSELBCORS=53B7490F14CB44B3C3CAE476A7D8BD7A112F66C8F807333E5C78FD4109F65AFEAFB0F879844BA5674BE47D52B41AEDC0C91AC16DC138FD2B53C4DF2AEF16B80681B7D92F02; _gssid=2500100654-c9tfyr0bff; visits=23; hwToken=7310bcf9f7c1c68ac4121e1ea9ec36ad; hwTime=1736492187829; _dd_s=logs=0&expire=1736493770948&rum=0",
        dnt: "1",
        "grab-id": "84ccfb24-b01e-465d-8896-a3d8290c8d99",
        priority: "u=1, i",
        referer: "https://merchant.grab.com/profile",
        requestsource: "troyPortal",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "x-agent": "mexapp",
        "x-app-platform": "web",
        "x-app-version": "1.2(v67)",
        "x-client-id": "GrabMerchant-Portal",
        "x-currency": "VND",
        "x-date": "2025-01-10T14:07:52+07:00",
        "x-device-id": "ios",
        "x-grabkit-clientid": "GrabMerchant-Portal",
        "x-language": "gb",
        "x-merchant-id": "VNMG202008280942581159036",
        "x-mex-resource": "zeus_store:5-CZDKKFMGBCCELE",
        "x-mex-version": "v2",
        "x-mts-jb": "false",
        "x-mts-ssid": token,
        "x-request-id": "a25fd93919a350ce7e9ea261c268d0b7",
        "x-user-type": "user-profile",
      },
    });
    //console.log("Store info:", response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching store info:", error);
    throw error;
  }
};
