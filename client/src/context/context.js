import React from "react";

import {
  initialState,
  AuthReducer,
  ClinicianAppointmentReducer,
  initialClinicianAptState,
  ClinicianChatMessageReducer,
  initialClinChatMsgState,
  PatientChatMessageReducer,
  initialPatientChatMsgState,
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

// clinician appointments ( handles available patients and specifics of patient when selected)
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

// patient appointments

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

// chat

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
