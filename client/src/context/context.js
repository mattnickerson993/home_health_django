import axios from "axios";
import React from "react";
import { api } from "../api";
import LogIn from "../pages/Login";
import { getRefreshToken, setLocalStorage } from "../utils/storage";

import {
  initialState,
  AuthReducer,
  ClinicianAppointmentReducer,
  initialClinicianAptState,
  ClinSchedAptReducer,
  initClinSchedAptState,
} from "./reducer";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ClinicianAptContext = React.createContext();

export const ClinicianAptProvider = ({ children }) => {
  const [clinicianApts, dispatchClinicianApts] = React.useReducer(
    ClinicianAppointmentReducer,
    initialClinicianAptState
  );

  const [clinschedapts, dispatchClinSchedApts] = React.useReducer(
    ClinSchedAptReducer,
    initClinSchedAptState
  );

  return (
    <ClinicianAptContext.Provider
      value={{
        clinicianApts,
        dispatchClinicianApts,
        clinschedapts,
        dispatchClinSchedApts,
      }}
    >
      {children}
    </ClinicianAptContext.Provider>
  );
};
