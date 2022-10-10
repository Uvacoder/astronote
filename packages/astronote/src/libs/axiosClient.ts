import axios, { AxiosHeaders } from "axios";
import { API_URL } from "../constants";

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export function getDefaultHeaders() {
  const accessToken = localStorage.getItem("access-token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}
