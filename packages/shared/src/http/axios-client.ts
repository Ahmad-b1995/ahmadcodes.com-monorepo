import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface AxiosClientConfig {
  baseURL: string;
  withCredentials?: boolean;
  getAccessToken?: () => string | null;
  onUnauthorized?: () => void;
}

export function createAxiosClient(config: AxiosClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: config.withCredentials ?? true,
  });

  instance.interceptors.request.use(
    (requestConfig) => {
      const token = config.getAccessToken?.();
      if (token && requestConfig.headers) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

export async function fetchData<T>(
  instance: AxiosInstance,
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await instance(url, config);
  return response.data;
}

