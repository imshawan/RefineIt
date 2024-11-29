import { http, parseParams } from "@refineit/utilities";
import { endpoints } from "@refineit/common";
import {ApiResponse, IProject} from "@refineit/types";

export const startNewReview = async (payload: {project_id: string}) => {
    try {
        return await http.post<ApiResponse.IBaseResponse>(endpoints.REVIEWS.NEW, payload);
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}

export const getReviewByProjectAndUser = async (payload: {projectId: string}) => {
    try {
        return await http.get<ApiResponse.IBaseResponse>(parseParams(endpoints.REVIEWS.GET_BY_PROJECT_USER, payload));
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}