import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {SignIn} from "../src/pages"
import { PrivateRoute } from "./PrivateRoute";

const Router = () => {
    const isAuthenticated = JSON.parse(localStorage.getItem("authenticated") || "false");
    console.log(isAuthenticated)

    return (
        <BrowserRouter>
          <Routes>
              <Route path="/sign-in" element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />} />
              {/* <Route path="/*" element={<NotFound />} /> */}
            </Routes>
        </BrowserRouter>
    )
}

export default Router;