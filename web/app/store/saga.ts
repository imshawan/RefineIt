import { all, fork } from "redux-saga/effects";
import projectsWatcherSaga from "./project/saga";

function* saga() {
    yield all([fork(projectsWatcherSaga)]);
}

export default saga;