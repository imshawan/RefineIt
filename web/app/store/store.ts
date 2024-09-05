import { combineReducers } from "@reduxjs/toolkit";
import {projectReducer} from "./project"

const appReducer = combineReducers({
    project: projectReducer,
});

const reducer = (state: {} | Partial<{}> | undefined, action: never) => appReducer(state, action);

export type AppState = ReturnType<typeof appReducer>;

export default reducer;
