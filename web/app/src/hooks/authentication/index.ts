import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from "../hook";
import { authActions } from '../../store/authentication';

export const useAuthentication = () => {
    const dispatch = useAppDispatch();

    return {
        signIn: useCallback((payload: any) => {
            dispatch(authActions.signInDispatch(payload));
        }, [dispatch]),
    };
}