
import { MutableObject } from "../types";

export * from "./http";

export const parseParams = (endpoint: string, params: MutableObject): string => {
    if (!endpoint || !params) {
        return endpoint;
    }
    if (typeof params !== 'object') {
        params = {};
    }
    if (!Object.keys(params).length) {
        return endpoint;
    }

    return endpoint.replace(/{{(.*?)}}/g, (match, paramName) => {
        if (!params[paramName]) {
            return '';
        }
        return params[paramName];
    });
}