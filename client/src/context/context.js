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
  ClinicianChatMessageReducer,
  initialClinChatMsgState,
  PatientChatMessageReducer,
  initialPatientChatMsgState,
  PatientSchedAptReducer,
  initPatientSchedAptState,
  ClinActiveAptReducer,
  initClinActiveAptState,
  initPatientActiveAptState,
  PatientActiveAptReducer,
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

  const [clinactiveapts, dispatchClinActiveApts] = React.useReducer(
    ClinActiveAptReducer,
    initClinActiveAptState
  );

  return (
    <ClinicianAptContext.Provider
      value={{
        clinicianApts,
        dispatchClinicianApts,
        clinactiveapts,
        dispatchClinActiveApts,
      }}
    >
      {children}
    </ClinicianAptContext.Provider>
  );
};

export const PatientAptContext = React.createContext();

export const PatientAptProvider = ({ children }) => {
  const [patientactiveapts, dispatchPatientActiveApts] = React.useReducer(
    PatientActiveAptReducer,
    initPatientActiveAptState
  );

  return (
    <PatientAptContext.Provider
      value={{
        patientactiveapts,
        dispatchPatientActiveApts,
      }}
    >
      {children}
    </PatientAptContext.Provider>
  );
};

export const ChatMessageContext = React.createContext();

export const ChatMessageProvider = ({ children }) => {
  const [clinicianChatMessages, dispatchClinicianChatMessages] =
    React.useReducer(ClinicianChatMessageReducer, initialClinChatMsgState);

  const [patientChatMessages, dispatchPatientChatMessages] = React.useReducer(
    PatientChatMessageReducer,
    initialPatientChatMsgState
  );
  return (
    <ChatMessageContext.Provider
      value={{
        clinicianChatMessages,
        dispatchClinicianChatMessages,
        patientChatMessages,
        dispatchPatientChatMessages,
      }}
    >
      {children}
    </ChatMessageContext.Provider>
  );
};
