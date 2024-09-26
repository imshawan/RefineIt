import { http, parseParams } from "@refineit/utilities";
import { endpoints } from "@refineit/common";
import {ApiResponse, IProject} from "@refineit/types";
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

export const getProjectBySlug = async (payload: {slug: string}) => {
    try {
        return await http.get<ApiResponse.IBaseResponse>(parseParams(endpoints.PROJECTS.GET_BY_SLUG, payload));
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}

export const createProject = async (payload: any) => {
    try {
        return await http.post<ApiResponse.IBaseResponse>(endpoints.PROJECTS.CREATE, payload);
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}

export const updateProject = async (payload: {params: object, body: object}) => {
    try {
        return await http.put<ApiResponse.IBaseResponse>(parseParams(endpoints.PROJECTS.UPDATE, payload.params), payload.body);
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}

export const handleStar = async (payload: {id: string, action: "STAR" | "UNSTAR"}) => {
    let urls = {STAR: endpoints.PROJECTS.STAR, UNSTAR: endpoints.PROJECTS.UN_STAR}
    let action = String(payload.action).toUpperCase() as keyof typeof urls;

    try {
        return await http.post<ApiResponse.IBaseResponse>(parseParams(urls[action], payload), {});
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}