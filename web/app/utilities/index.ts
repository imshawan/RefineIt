
import { MutableObject } from "../types";

export * from "./http";

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