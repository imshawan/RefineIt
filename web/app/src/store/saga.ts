import { all, fork } from 'redux-saga/effects';
import {authenticationWatcherSaga} from "./authentication"

function* saga() {
    yield all([fork(authenticationWatcherSaga)]);
}

export default saga;