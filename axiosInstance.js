import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.137.224:3000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
