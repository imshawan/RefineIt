export const API_SERVER_HOST = "http://localhost:4000";

export const endpoints = {
    AUTH: {
        SIGN_IN: `${API_SERVER_HOST}/api/auth/sign-in`,
    },
    USERS: {
        REGISTER: `${API_SERVER_HOST}/api/users/register`,
        PROFILE: `${API_SERVER_HOST}/api/users/{{userId}}/profile`
    }
}