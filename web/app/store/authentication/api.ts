import { http } from "@refineit/utilities";
import { endpoints } from "@refineit/common";
import {ApiResponse} from "@refineit/types";

export const signInUser = async (payload: any) => await http.post<ApiResponse.BaseResponse>(endpoints.AUTH.SIGN_IN, payload);