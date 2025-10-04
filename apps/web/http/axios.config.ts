import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function fetchData<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance(url, config);
  return response.data;
}

export default axiosInstance;

