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

    interface ISignInUser extends IUser {
        token: string;
    }

    // Define the main response interface
    interface IBaseResponse {
        statusCode: number;
        status: {
            code: string;
            error: boolean;
            route: string;
            message: string;
        }
        response: string | Array | object
    }

    interface IPaginationResponse extends IBaseResponse {
        response: IPagination
    }

    interface IPagination {
        data: Array<any>;
        current_page: number;
        per_page: number;
        total_pages: number;
        total_items: number;
        navigation: INavigation;
    }

    interface INavigation {
        current: string;
        next: string;
        previous: string;
    }
}
