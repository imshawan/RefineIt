import { combineReducers } from "@reduxjs/toolkit";
import {projectReducer} from "./project"
import { editorReducer } from "./editor";
import { reviewReducer } from "./review/slice";

const appReducer = combineReducers({
    project: projectReducer,
    editor: editorReducer,
    review: reviewReducer,
});

const reducer = (state: {} | Partial<{}> | undefined, action: never) => appReducer(state, action);

export type AppState = ReturnType<typeof appReducer>;

export default reducer;
