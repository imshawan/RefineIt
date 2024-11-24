import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@refineit/hooks/hook";
import * as Slice from "@refineit/store/editor";

export const useEditor = () => {
    const dispatch = useAppDispatch();

    return {
        setCode: useCallback((payload: any) => {
            dispatch(Slice.editorActions.setCode(payload));
        }, [dispatch]),
        setAdditionsAndDeletions: useCallback((payload: any) => {
            dispatch(Slice.editorActions.setAdditionsAndDeletions(payload));
        }, [dispatch]),

        code: useAppSelector(Slice.getCode),
        additions: useAppSelector(Slice.getAdditions),
        deletions: useAppSelector(Slice.getDeletions),
    };
}