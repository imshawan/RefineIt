import React from "react";
import { projectActions, getters } from "@refineit/store/project";
import { useAppDispatch, useAppSelector } from "@refineit/hooks/hook";

export const useProject = () => {
    const dispatch = useAppDispatch();

    return {
        loadProjects: React.useCallback((payload: any) => {
            dispatch(projectActions.loadProjectsDispatch(payload));
        }, [dispatch]),
        setLoading: React.useCallback((payload: boolean) => {
            dispatch(projectActions.setLoading(payload));
        }, [dispatch]),


        loading: useAppSelector(getters.loading),
        projects: useAppSelector(getters.projects),
        pagination: useAppSelector(getters.pagination)
    }
}