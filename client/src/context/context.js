import axios from "axios";
import React from "react";
import { api } from "../api";
import LogIn from "../pages/Login";
import { getRefreshToken, setLocalStorage } from "../utils/storage";

import { initialState, AuthReducer } from "./reducer";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
