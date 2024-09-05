import _ from "lodash";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_SERVER_HOST } from "@refineit/common";
import { ApiResponse } from "@refineit/types/response";
import { UserTokenStore } from "@refineit/lib";

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

const doRequest = async <T>(url: string, method: keyof AxiosInstance, config: AxiosRequestConfig = {}, data?: any, external: boolean = false): Promise<T> => {
    let instance: AxiosInstance = external ? axios : axiosInstance;

    if (!external) {
        if (!config.headers) {
            config.headers = {};
        }
        config.headers["Authorization"] = "Bearer " + UserTokenStore.getJwtToken();
    }

    try {
        let response: AxiosResponse<T>;

        switch (method) {
        case "get":
        case "delete":
        case "head":
        case "options":
            response = await instance[method](url, config);
            break;
        case "post":
        case "put":
        case "patch":
            response = await instance[method](url, data, config);
            break;
        default:
            throw new Error(`Unsupported method: ${method}`);
        }
        
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}


export const http = {
    async get<T>(url: string, config: AxiosRequestConfig = {}, external: boolean = false): Promise<T> {
        config = { ...config, headers: getHeaders(config) };
        return await doRequest(url, "get", config, null, external);
    },

    async post<T>(url: string, data: any, config: AxiosRequestConfig = {}, isFormData = false, external: boolean = false): Promise<T> {
        config = { ...config, headers: getHeaders(config, isFormData) };
        return doRequest(url, "post", config, data, external);
    },

    async put<T>(url: string, data: any, config: AxiosRequestConfig = {}, isFormData = false, external: boolean = false): Promise<T> {
        config = { ...config, headers: getHeaders(config, isFormData) };
        return doRequest(url, "put", config, data, external);
    },

    async delete<T>(url: string, config: AxiosRequestConfig = {}, external: boolean = false): Promise<T> {
        config = { ...config, headers: getHeaders(config) };
        return doRequest(url, "delete", config);
    },

    parseHttpError(error: Error): ApiResponse.IBaseResponse | string {
        if (axios.isAxiosError(error) && error.response) {
            const { status: statusCode, data } = error.response;

            if (error.code === "ECONNREFUSED") {
                throw new Error("Network error, connection refused");
            }

            return _.merge(data, { statusCode }) as ApiResponse.IBaseResponse;
        }

        return error.message;
    },

    isHttpError(error: any): error is ApiResponse.IBaseResponse {
        return typeof error === "object" && error !== null && "statusCode" in error && "status" in error;
    }
};

// Function to handle 401 and other errors based on status codes
function handleApiError(error: any, external: boolean = false) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 && !external && typeof window !== "undefined") {
            if (window.location.pathname !== "/signin") handleLogout();
        }
    }
}