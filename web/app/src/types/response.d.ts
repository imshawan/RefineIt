export namespace ApiResponse {
    // Define the User interface
    interface User {
        id: string;
        username: string;
        email: string;
        fullname: string;
        created_at: string; // ISO 8601 date string
        updated_at: string; // ISO 8601 date string
        is_active: boolean;
    }

    // Define the main response interface
    export interface BaseResponse {
        status: {
            code: string;
            error: boolean;
            route: string;
            message: string;
        }
        response: any
    }
}
