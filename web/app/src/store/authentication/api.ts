import { http } from "../../utilities";
import { endpoints } from "../../common";
import {ApiResponse} from "../../types";

export const signInUser = async (payload: any) => await http.post<ApiResponse.BaseResponse>(endpoints.AUTH.SIGN_IN, payload);