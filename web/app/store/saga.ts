import { all, fork } from "redux-saga/effects";

function* saga() {
    // yield all([fork(authenticationWatcherSaga)]);
}

export default saga;