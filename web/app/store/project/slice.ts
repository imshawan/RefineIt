
import { createAction, createSlice, } from "@reduxjs/toolkit";
import { ApiResponse, IProject } from "@refineit/types";
import { AppState } from "../store";

interface IProjectState {
    loading: boolean;
    projects: IProject[];
    pagination: IPagination
}

interface IPagination {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    navigation: ApiResponse.INavigation;
}

const initialState: IProjectState = {
    loading: true,
    projects: [],
    pagination: {
        current_page: 0,
        navigation: {current: "", next: "", previous: ""},
        per_page: 10,
        total_items: 0,
        total_pages: 0
    }
};

export const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPagination(state, action) {
            state.pagination = action.payload;
        },
        setProjects(state, action) {
            state.projects = action.payload;
        },
        pushProjects(state, action) {
            state.projects.push(action.payload);
        },
        deleteProject(state, action) {
            state.projects = state.projects.filter((project) => project.id !== action.payload);
        },
        updateProject(state, action) {
            const index = state.projects.findIndex((project) => project.id === action.payload.id);
            state.projects[index] = action.payload;
        },
    }
});

export const projectActions = {
    loadProjectsDispatch: createAction(`${projectSlice.name}/set-projects`, (payload) => ({ payload })),
    pushProjectsDispatch: createAction(`${projectSlice.name}/add-project`, (payload) => ({ payload })),
    deleteProjectDispatch: createAction(`${projectSlice.name}/delete-project`, (payload) => ({ payload })),
    updateProjectDispatch: createAction(`${projectSlice.name}/update-project`, (payload) => ({ payload })),
    
    setLoading: projectSlice.actions.setLoading,
    setPagination: projectSlice.actions.setPagination,
    setProjects: projectSlice.actions.setProjects,
    pushProjects: projectSlice.actions.pushProjects,
    deleteProject: projectSlice.actions.deleteProject,
    updateProject: projectSlice.actions.updateProject
};

export const getters = {
    loading: (state: AppState) => state.project.loading,
    projects: (state: AppState) => state.project.projects,
    pagination: (state: AppState) => state.project.pagination,
};

export const projectReducer = projectSlice.reducer;
