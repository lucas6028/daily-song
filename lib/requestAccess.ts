import axios from "axios";

export default async function RequestAccess(urlCode: string) {
  if (!urlCode) {
    console.error("Authorization code is missing from URL");
    return;
  }

  await axios
    .get("/api/login", {
      params: {
        code: urlCode,
      },
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);

      window.history.pushState({}, "", "/login");
    })
    .catch((err) => {
      console.error("Error posting code:", err);
    });
}
