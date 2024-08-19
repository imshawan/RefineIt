import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import saga from "./saga";
import reducer from "./store";

const makeStore = () => {
    const sagaMiddleware = createSagaMiddleware();

    const store = configureStore({
        reducer: reducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware({
                thunk: false,
                serializableCheck: false,
            }).concat(sagaMiddleware),

    });

    sagaMiddleware.run(saga);

    return store;
};

export const store = makeStore();

export const AppDispatch = store.dispatch;
export const RootState = store.getState;
