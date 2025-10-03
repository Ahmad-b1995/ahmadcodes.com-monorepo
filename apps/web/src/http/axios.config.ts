import { log, logError } from "@/utils/logger";
import axios, {
 AxiosRequestConfig,
 AxiosResponse,
 InternalAxiosRequestConfig,
 AxiosError,
} from "axios";

// Custom error types for better error handling
export interface ApiError {
 message: string;
 status?: number;
 code?: string;
 details?: any;
}

export class NetworkError extends Error {
 constructor(
 message: string,
 public status?: number,
 public code?: string,
 public details?: any
 ) {
 super(message);
 this.name = "NetworkError";
 }
}

export const fetchData = async <T>(
 url: string,
 options?: AxiosRequestConfig
): Promise<T> => {
 try {
 const response = await axiosInstance.get<T>(url, options);
 return response.data;
 } catch (error) {
 // Don't double-wrap NetworkError - just re-throw it
 if (error instanceof NetworkError) {
 throw error;
 }
 
 // Handle other unexpected errors
 if (axios.isAxiosError(error)) {
 const axiosError = error as AxiosError;
 const errorMessage = `Failed to fetch data from ${url}`;
 const status = axiosError.response?.status;
 const statusText = axiosError.response?.statusText;
 
 logError(`${errorMessage} - Status: ${status} ${statusText}`, {
 url,
 status,
 statusText,
 responseData: axiosError.response?.data,
 requestConfig: options,
 });

 throw new NetworkError(
 `${errorMessage}: ${statusText || axiosError.message}`,
 status,
 axiosError.code,
 axiosError.response?.data
 );
 }
 
 // Handle truly unexpected errors (non-Axios, non-NetworkError)
 logError(`Unexpected error while fetching data from ${url}`, {
 url,
 error: error instanceof Error ? error.message : String(error),
 requestConfig: options,
 });
 
 throw new NetworkError(
 `Unexpected error occurred while fetching data from ${url}`,
 undefined,
 undefined,
 error
 );
 }
};

export const axiosInstance = axios.create({
 headers: {
 "Content-type": "application/json",
 accept: "application/json",
 },
 timeout: 10000,
});

axiosInstance.interceptors.request.use(
 (config: InternalAxiosRequestConfig) => {
 log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`, {
 method: config.method,
 url: config.url,
 });
 return config;
 },
 (error) => {
 const errorMessage = "Request configuration failed";
 
 logError(errorMessage, {
 error: error instanceof Error ? error.message : String(error),
 });

 return Promise.reject(
 new NetworkError(
 errorMessage,
 undefined,
 "REQUEST_CONFIG_ERROR",
 error
 )
 );
 }
);

axiosInstance.interceptors.response.use(
 (response: AxiosResponse) => {
 log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
 status: response.status,
 url: response.config.url,
 method: response.config.method,
 });
 return response;
 },
 (error: AxiosError) => {
 const url = error.config?.url || "unknown endpoint";
 const method = error.config?.method?.toUpperCase() || "REQUEST";
 const status = error.response?.status;
 
 let errorMessage: string;
 let errorCode: string;

 // Handle specific error scenarios
 if (error.code === "ECONNABORTED") {
 errorMessage = `⏱️ Request timed out: ${method} ${url}`;
 errorCode = "TIMEOUT";
 } else if (error.code === "ERR_NETWORK") {
 errorMessage = `🌐 Network unreachable: Cannot connect to ${url}`;
 errorCode = "NETWORK_UNREACHABLE";
 } else if (status) {
 switch (status) {
 case 400:
 errorMessage = `❌ Bad Request: Invalid data sent to ${url}`;
 errorCode = "BAD_REQUEST";
 break;
 case 401:
 errorMessage = `🔐 Unauthorized: Please login to access ${url}`;
 errorCode = "UNAUTHORIZED";
 break;
 case 403:
 errorMessage = `🚫 Forbidden: Access denied to ${url}`;
 errorCode = "FORBIDDEN";
 break;
 case 404:
 errorMessage = `📭 Not Found: ${url} does not exist`;
 errorCode = "NOT_FOUND";
 break;
 case 429:
 errorMessage = `🚦 Too Many Requests: Rate limited on ${url}`;
 errorCode = "RATE_LIMITED";
 break;
 case 500:
 errorMessage = `💥 Server Error: Internal problem at ${url}`;
 errorCode = "SERVER_ERROR";
 break;
 case 502:
 errorMessage = `🔌 Bad Gateway: Upstream server issue for ${url}`;
 errorCode = "BAD_GATEWAY";
 break;
 case 503:
 errorMessage = `🔧 Service Unavailable: ${url} is temporarily down`;
 errorCode = "SERVICE_UNAVAILABLE";
 break;
 default:
 errorMessage = `⚠️ HTTP ${status}: ${method} request to ${url} failed`;
 errorCode = `HTTP_${status}`;
 }
 } else {
 errorMessage = `❓ Unknown error: ${method} request to ${url} failed`;
 errorCode = "UNKNOWN_ERROR";
 }

 // Log the error with clean, structured information
 logError(errorMessage, {
 url,
 method,
 status,
 errorCode,
 responseData: error.response?.data,
 timestamp: new Date().toISOString(),
 });

 // Create and throw the enhanced error (don't use Promise.reject in interceptor)
 throw new NetworkError(
 errorMessage,
 status,
 errorCode,
 {
 originalError: error.message,
 responseData: error.response?.data,
 url,
 method,
 }
 );
 }
);

export default axiosInstance;