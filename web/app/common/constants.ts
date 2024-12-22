export const API_SERVER_HOST = "http://localhost:4000";

export const endpoints = {
    AUTH: {
        SIGN_IN: `${API_SERVER_HOST}/api/auth/sign-in`,
    },
    USERS: {
        REGISTER: `${API_SERVER_HOST}/api/users/register`,
        PROFILE: `${API_SERVER_HOST}/api/users/{{userId}}/profile`,
        CHECK_USERNAME_AVAILABILITY: `${API_SERVER_HOST}/api/users/username/{{name}}`,
    },
    GITHUB: {
        REPOSITORY_SEARCH: "/api/github/search-code/?{{query}}"
    },
    PROJECTS: {
        CREATE: API_SERVER_HOST + "/api/projects/new",
        UPDATE: API_SERVER_HOST + "/api/projects/update/{{id}}",
        DELETE: API_SERVER_HOST + "/api/projects/{{id}}",
        GET_ALL: API_SERVER_HOST + "/api/projects/?{{query}}",
        GET_BY_SLUG: API_SERVER_HOST + "/api/projects/{{slug}}",
        STAR: API_SERVER_HOST + "/api/projects/star/{{id}}",
        UN_STAR: API_SERVER_HOST + "/api/projects/unstar/{{id}}",
    },
    REVIEWS: {
        NEW: API_SERVER_HOST + "/api/reviews/new",
        GET_BY_PROJECT_USER: API_SERVER_HOST + "/api/reviews/project/{{projectId}}",
        GET_BY_PROJECT: API_SERVER_HOST + "/api/reviews/project/{{projectId}}/all?{{query}}",
        UPDATE_CONTENT: API_SERVER_HOST + "/api/reviews/update/{{reviewId}}"
    }
}

export const externals = {
    github: {
        REPOSITORY: "https://api.github.com/repos/{{owner}}/{{repo}}",
        REPOSITORY_CONTENT: "https://api.github.com/repos/{{owner}}/{{repo}}/contents/{{name}}",
        REPOSITORY_SEARCH: "https://api.github.com/search/code?q={{query}}"
    }
}