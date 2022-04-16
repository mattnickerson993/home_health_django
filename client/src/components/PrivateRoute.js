import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthState();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login/" />;
};

export default PrivateRoute;
