import { call, put, takeEvery } from "redux-saga/effects";
import { reviewActions } from "./slice";
import { getReviewByProject } from "./api";
import { ApiResponse, IFetchQueryPayload } from "@refineit/types";

function* onReviewsLoadPaginated({ payload }: { payload: {projectId: string, fields: [], page: number} }): Generator<any, void, string | ApiResponse.IBaseResponse> {
    try {
        const data: string | ApiResponse.IBaseResponse = yield call(getReviewByProject, payload);
        if (typeof data === "object") {
            let {data: reviews, ...rest} = data.response;
            if (!payload.page || payload.page <= 1) {
                yield put(reviewActions.setReviews(reviews));
            } else {
                yield put(reviewActions.pushReviews(reviews));
            }
            yield put(reviewActions.setLoading(false));
            yield put(reviewActions.setPagination(rest));
        }
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}

export default function* reviewssWatcherSaga() {
    yield takeEvery(reviewActions.loadReviewsDispatch, onReviewsLoadPaginated);
}