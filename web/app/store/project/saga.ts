import { call, put, takeEvery } from "redux-saga/effects";
import { projectActions } from "./slice";
import { getProjects } from "./api";
import { IProjectFetchPayload } from "./api";
import { ApiResponse } from "@refineit/types";

function* onProjectsLoad(): Generator<any, void, string | ApiResponse.IBaseResponse> {
    try {
        // Yield the call effect to the Redux-Saga middleware
        const data: string | ApiResponse.IBaseResponse = yield call(getProjects);
        if (typeof data === "object") {
            let {data: projects, ...rest} = data.response;
            yield put(projectActions.setProjects(projects));
            yield put(projectActions.setLoading(false));
            yield put(projectActions.setPagination(rest));
        }
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

function* onProjectsLoadPaginated({ payload }: { payload: IProjectFetchPayload }): Generator<any, void, string | ApiResponse.IBaseResponse> {
    try {
        const data: string | ApiResponse.IBaseResponse = yield call(getProjects, payload);
        if (typeof data === "object") {
            let {data: projects, ...rest} = data.response;
            yield put(projectActions.pushProjects(projects));
            yield put(projectActions.setLoading(false));
            yield put(projectActions.setPagination(rest));
        }
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

export default function* projectsWatcherSaga() {
    yield takeEvery(projectActions.loadProjectsDispatch, onProjectsLoad);
    yield takeEvery(projectActions.loadProjectsPaginatedDispatch, onProjectsLoadPaginated);
}