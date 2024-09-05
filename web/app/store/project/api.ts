import { http, parseParams } from "@refineit/utilities";
import { endpoints } from "@refineit/common";
import {ApiResponse} from "@refineit/types";
import { UserTokenStore } from "@refineit/lib";

export interface IProjectFetchPayload {
    page?: number
    limit?: number
    sortBy?: string
    q?: string
}

export const getProjects = async (payload?: IProjectFetchPayload) => {
    let query;

    if (payload && Object.keys(payload).length) {
        let stringifiedPayload = Object.fromEntries(
            Object.entries(payload).map(([key, value]) => [key, String(value)])
        );
        query = new URLSearchParams(stringifiedPayload).toString();
    }

    try {
        return await http.get<ApiResponse.IBaseResponse>(parseParams(endpoints.PROJECTS.GET_ALL, {query}));
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}