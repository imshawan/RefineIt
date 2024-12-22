import React from "react";
import { projectActions, getters } from "@refineit/store/project";
import { FetchReviewPayload, reviewActions, getters as reviewGetters, } from "@refineit/store/review";
import { useAppDispatch, useAppSelector } from "@refineit/hooks/hook";
import { IFetchQueryPayload } from "@refineit/types";

export const useProject = () => {
    const dispatch = useAppDispatch();

    return {
        loadInitialProjects: React.useCallback((payload?: IFetchQueryPayload) => {
            dispatch(projectActions.loadProjectsDispatch(payload));
        }, [dispatch]),
        loadProjectsPaginated: React.useCallback((payload?: IFetchQueryPayload) => {
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
        pagination: useAppSelector(getters.pagination),
        searchTerm: useAppSelector(getters.searchTerm)
    }
}

export const useReviews = () => {
    const dispatch = useAppDispatch();

    return {
        loadInitialReviews: React.useCallback((payload?: FetchReviewPayload) => {
            dispatch(reviewActions.loadReviewsDispatch(payload));
        }, [dispatch]),
        loadProjectsPaginated: React.useCallback((payload?: FetchReviewPayload) => {
            dispatch(reviewActions.loadReviewsPaginatedDispatch(payload));
        }, [dispatch]),
        setLoading: React.useCallback((payload: boolean) => {
            dispatch(reviewActions.setLoading(payload));
        }, [dispatch]),


        loading: useAppSelector(reviewGetters.loading),
        reviews: useAppSelector(reviewGetters.reviews),
        pagination: useAppSelector(reviewGetters.pagination),
    }
}