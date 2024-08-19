import { http, parseParams } from "@refineit/utilities";
import { endpoints } from "@refineit/common";
import {ApiResponse} from "@refineit/types";

interface IUserRegisteration {
    fullname: string;
    username: string;
    email: string;
    password: string;
    agreeTerms: boolean;
}

export const signInUser = async (payload: any) => await http.post<ApiResponse.IBaseResponse>(endpoints.AUTH.SIGN_IN, payload);

export const checkUsernameAvailibility = async (payload: {name: string}) => {
    try {
        return await http.get<ApiResponse.IBaseResponse>(parseParams(endpoints.USERS.CHECK_USERNAME_AVAILABILITY, payload));
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}

export const registerUser = async (payload: IUserRegisteration) => {
    try {
        return await http.post<ApiResponse.IBaseResponse>(endpoints.USERS.REGISTER, payload);
    } catch (err: any) {
        return http.parseHttpError(err);
    }
}