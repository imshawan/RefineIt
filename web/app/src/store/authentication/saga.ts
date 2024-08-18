import { call, put, takeEvery } from 'redux-saga/effects';
import { authActions } from './slice';
import { signInUser } from './api';
import { ApiRequests } from '../../types';

// Define types for the payload and error
interface FormValues {
    username: string;
    password: string;
}

// Define the type of the response from the API call
interface SignInResponse {
    success: boolean;
    // Add other properties based on your API response
}

// Define a type for possible errors
interface ApiError {
    message: string;
}

// Define the type for the generator function
export function* onSubmitAuth({ payload }: { payload: ApiRequests.SagaRequestPayload }): Generator<any, void, SignInResponse | ApiError> {
    let {success, failure, formValues} = payload;
    try {
        const loginSucc = yield call(signInUser, formValues);
        console.log(loginSucc);
        if (success && typeof success === 'function') success(loginSucc);

    } catch (error: any) {
        if (error && error.response && error.response.data) {
            let {data} = error.response;
            if (data.status && data.status.message) {
                if (failure && typeof failure === 'function') failure(data.status.message);
            }
        }
        // Handle errors with a proper action
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    }
}

export function* authenticationWatcherSaga() {
    yield takeEvery(authActions.signInDispatch, onSubmitAuth);
}


