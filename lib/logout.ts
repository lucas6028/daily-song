import axios from "axios";

export const handleLogout = async () => {
  try {
    const res = await axios.delete("/api/auth", {
      withCredentials: true,
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error while log out: " + err);
  }
};
