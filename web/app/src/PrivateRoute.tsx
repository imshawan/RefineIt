import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
    role?: string;
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps>  = ({ role, children }) => {
    const isAuthenticated = JSON.parse(localStorage.getItem("authenticated") || "false");
    const { pathname } = useLocation();

    if (isAuthenticated && pathname !== '/sign-in') {
        return children ? <React.Fragment>{children}</React.Fragment> : <Outlet />
    } else {
        return <Navigate to="/sign-in" />
    }
};