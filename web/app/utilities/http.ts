import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_SERVER_HOST } from "@refineit/common";

const handleLogout = (): void => {
    // ["user", "authenticated", "token"].forEach(e => localStorage.removeItem(e));

    // Redirect to login page
    // window.location.href = "/sign-in";
};

// Utility function to get headers
const getHeaders = (config: AxiosRequestConfig = {}, isFormData = false): AxiosRequestConfig["headers"] => {
    const headers: AxiosRequestConfig["headers"] = {};

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return {
        ...config.headers,
        ...headers
    };
}

// Create an instance of Axios
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_SERVER_HOST,
    headers: {
        "Accept": "application/json, text/plain, */*",
    },
    timeout: 30000, // Set a timeout limit (optional)
});


export const http = {
    async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.get(url, { ...config, headers: getHeaders(config) });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    async post<T>(url: string, data: any, config: AxiosRequestConfig = {}, isFormData = false): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.post(url, data, { ...config, headers: getHeaders(config, isFormData) });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    async put<T>(url: string, data: any, config: AxiosRequestConfig = {}, isFormData = false): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.put(url, data, { ...config, headers: getHeaders(config, isFormData) });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axiosInstance.delete(url, { ...config, headers: getHeaders(config) });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },
};

// Function to handle errors
function handleApiError(error: any) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
            if (window.location.pathname !== "/signin") handleLogout();
        }
    }
}