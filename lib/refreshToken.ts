import axios from "axios";

async function refreshToken() {
  try {
    const res = await axios.get("/api/refresh", {
      withCredentials: true,
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error while refresh token: " + err);
  }
}

export default refreshToken;
