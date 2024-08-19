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

    interface ISignInUser extends User {
        token: string;
    }

    // Define the main response interface
    interface BaseResponse {
        status: {
            code: string;
            error: boolean;
            route: string;
            message: string;
        }
        response: string | Array | object
    }
}
