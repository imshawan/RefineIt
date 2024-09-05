import React from "react";
import { projectActions, getters, IProjectFetchPayload } from "@refineit/store/project";
import { useAppDispatch, useAppSelector } from "@refineit/hooks/hook";

export const useProject = () => {
    const dispatch = useAppDispatch();

    return {
        loadInitialProjects: React.useCallback((payload?: IProjectFetchPayload) => {
            dispatch(projectActions.loadProjectsDispatch(payload));
        }, [dispatch]),
        loadProjectsPaginated: React.useCallback((payload?: IProjectFetchPayload) => {
            dispatch(projectActions.loadProjectsPaginatedDispatch(payload));
        }, [dispatch]),
        setLoading: React.useCallback((payload: boolean) => {
            dispatch(projectActions.setLoading(payload));
        }, [dispatch]),
        setSearch: React.useCallback((payload: string) => {
            dispatch(projectActions.setSearch(payload));
        }, [dispatch]),


        loading: useAppSelector(getters.loading),
        projects: useAppSelector(getters.projects),
        pagination: useAppSelector(getters.pagination)
    }
}