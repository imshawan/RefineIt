
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

export const formatNumberWithMetricPrefix = (num: number): string => {
    if (num === 0 || num < 1) return "0";
    const suffixes = ["", "k", "M", "B", "T"];

    let tier = Math.floor(Math.log10(Math.abs(num)) / 3); // Determine the magnitude tier

    if (tier === 0) return num.toString(); // No suffix needed for values less than 1000

    const suffix = suffixes[tier];
    const scale = Math.pow(10, tier * 3); // Scale down the number based on the tier

    const scaledNum = num / scale;

    // Round the scaled number to 1 decimal place if necessary
    const formattedNum = scaledNum.toFixed(1).replace(/\.0$/, ""); // Remove the decimal if not needed

    return `${formattedNum}${suffix}`;
}