import { all, fork } from "redux-saga/effects";
import projectsWatcherSaga from "./project/saga";
import reviewssWatcherSaga from "./review/saga";

function* saga() {
    yield all([fork(projectsWatcherSaga)]);
    yield all([fork(reviewssWatcherSaga)]);
}

export default saga;