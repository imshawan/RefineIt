
// DUCKS pattern
import { createAction, createSlice, } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    authenticated: null,
	user: {}
};

export const authSlice = createSlice({
	name: "authentication",
	initialState,
	reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setIsAuthenticated: (state, action) => {
            state.authenticated = action.payload
        },
	},
});

export const authActions = {
	signInDispatch: createAction(`${authSlice.name}/sign-in`, (payload) => ({ payload })),
	setUserDetails: createAction(`${authSlice.name}/set-user-details`, (payload) => ({ payload })),
	setToken: createAction(`${authSlice.name}/set-token`, (payload) => ({ payload })),
	setIsAuthenticated: createAction(`${authSlice.name}/set-is-authenticated`, (payload) => ({ payload })),
};


export const authenticationReducer = authSlice.reducer;
