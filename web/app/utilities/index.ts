
import { MutableObject } from "../types";

export * from "./http";
export * from "./misc";

export const parseParams = (endpoint: string, params: MutableObject): string => {
    if (!endpoint || !params) {
        return endpoint;
    }
    if (typeof params !== "object") {
        params = {};
    }
    if (!Object.keys(params).length) {
        return endpoint;
    }

    return endpoint.replace(/{{(.*?)}}/g, (match, paramName) => {
        if (!params[paramName]) {
            return "";
        }
        return params[paramName];
    });
}

/**
 * A python-like sleep function that pauses execution for a specified duration
 * @param ms {Number}
 * @returns 
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(3));
    return `${formattedValue} ${sizes[i]}`;
};