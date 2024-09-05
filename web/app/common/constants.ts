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
        GET_ALL: API_SERVER_HOST + "/api/projects/?{{query}}"
    }
}

export const externals = {
    github: {
        REPOSITORY: "https://api.github.com/repos/{{owner}}/{{repo}}",
        REPOSITORY_CONTENT: "https://api.github.com/repos/{{owner}}/{{repo}}/contents/{{name}}",
        REPOSITORY_SEARCH: "https://api.github.com/search/code?q={{query}}"
    }
}