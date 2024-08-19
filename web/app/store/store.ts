import { combineReducers } from "@reduxjs/toolkit";

const appReducer = combineReducers({
    // authentication: authenticationReducer,
});

const reducer = (state: {} | Partial<{}> | undefined, action: never) => appReducer(state, action);

export default reducer;
