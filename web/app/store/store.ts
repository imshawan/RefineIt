import { combineReducers } from "@reduxjs/toolkit";
import {projectReducer} from "./project"
import { editorReducer } from "./editor";

const appReducer = combineReducers({
    project: projectReducer,
    editor: editorReducer
});

const reducer = (state: {} | Partial<{}> | undefined, action: never) => appReducer(state, action);

export type AppState = ReturnType<typeof appReducer>;

export default reducer;
