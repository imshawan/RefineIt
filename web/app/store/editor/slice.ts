
import { createAction, createSlice, } from "@reduxjs/toolkit";

const initialState = {
    code: "",
    additions: 0,
    deletions: 0,
};

export const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setCode: (state, action) => {
            state.code = action.payload
        },
        setAdditionsAndDeletions: (state, action) => {
            state.additions = action.payload.additions;
            state.deletions = action.payload.deletions;
        },
    },
});

export const editorActions = {
    setCode: editorSlice.actions.setCode,
    setAdditionsAndDeletions: editorSlice.actions.setAdditionsAndDeletions
};

export const getCode = (state: {editor: typeof initialState}) => state.editor.code;
export const getAdditions = (state: {editor: typeof initialState}) => state.editor.additions;
export const getDeletions = (state: {editor: typeof initialState}) => state.editor.deletions;

export const editorReducer = editorSlice.reducer;