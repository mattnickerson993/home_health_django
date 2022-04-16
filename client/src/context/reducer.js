import { getUser, removeUser } from "../services/authService";
import { setLocalStorage } from "../utils/storage";

export const initialState = {
  userDetails: getUser(),
  isAuthenticated: getUser() && true,
  errorMessage: "",
  loading: false,
};

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      setLocalStorage(action.payload);
      return {
        ...state,
        userDetails: getUser(),
        isAuthenticated: true,
        loading: false,
      };
    }

    case "LOGOUT":
      removeUser();
      return {
        ...state,
        isAuthenticated: false,
        userDetails: "",
      };

    case "LOGIN_FAIL": {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return {
        ...state,
        isAuthenticated: false,
        errorMessage: action.payload.errorMessage,
      };
    }

    case "AUTHENTICATED_SUCCESS": {
      return {
        ...state,
        userDetails: getUser(),
        isAuthenticated: true,
        loading: false,
      };
    }

    case "AUTHENTICATED_FAIL": {
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        userDetails: "",
      };
    }

    default: {
      return state;
    }
  }
};

// clinician avialable apts

export const initialClinicianAptState = {
  appointments: null,
  loading: true,
};

export const ClinicianAppointmentReducer = (state, action) => {
  switch (action.type) {
    case "ADD_APPOINTMENTS": {
      return {
        appointments: action.payload,
        loading: false,
      };
    }
    case "ADD_APPOINTMENT": {
      return {
        ...state,
        appointments: [action.payload, ...state.appointments],
      };
    }
    case "REMOVE_APPOINTMENT": {
      return {
        ...state,
        appointments: state.appointments.filter(
          (apt) => apt.id !== action.payload.id
        ),
      };
    }
    default: {
      return state;
    }
  }
};

// clinician active apts (ie 1 patient)

export const initClinActiveAptState = {
  clinschedapts: null,
  clin_inroute_apts: null,
  clin_arrived_apts: null,
  loading: true,
};

export const ClinActiveAptReducer = (state, action) => {
  switch (action.type) {
    case "ADD_APPOINTMENTS": {
      return {
        clinschedapts: action.payload.filter(
          (apt) => apt.status === "SCHEDULED"
        ),
        clin_inroute_apts: action.payload.filter(
          (apt) => apt.status === "IN_ROUTE"
        ),
        clin_arrived_apts: action.payload.filter(
          (apt) => apt.status === "ARRIVED"
        ),
        loading: false,
      };
    }
    case "ADD_APPOINTMENT": {
      return {
        ...state,
        clinschedapts:
          action.payload.status === "SCHEDULED"
            ? [action.payload, ...state.clinschedapts]
            : [],
        clin_inroute_apts:
          action.payload.status === "IN_ROUTE"
            ? [action.payload, ...state.clin_inroute_apts]
            : [],
        clin_arrived_apts:
          action.payload.status === "ARRIVED"
            ? [action.payload, ...state.clin_arrived_apts]
            : [],
      };
    }

    default: {
      return state;
    }
  }
};

// patient apts

export const initPatientActiveAptState = {
  patientschedapts: [],
  patient_inroute_apts: [],
  patient_arrived_apts: [],
  loading: true,
  clincoords: null,
};

export const PatientActiveAptReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_APPOINTMENTS": {
      return {
        ...state,
        patientschedapts: action.payload.filter(
          (apt) => apt.status === "SCHEDULED"
        ),
        patient_inroute_apts: action.payload.filter(
          (apt) => apt.status === "IN_ROUTE"
        ),
        patient_arrived_apts: action.payload.filter(
          (apt) => apt.status === "ARRIVED"
        ),
        loading: false,
      };
    }
    case "ADD_APPOINTMENT": {
      return {
        ...state,
        patientschedapts:
          action.payload.status === "SCHEDULED"
            ? [action.payload, ...state.patientschedapts]
            : [],
        patient_inroute_apts:
          action.payload.status === "IN_ROUTE"
            ? [action.payload, ...state.patient_inroute_apts]
            : [],
        patient_arrived_apts:
          action.payload.status === "ARRIVED"
            ? [action.payload, ...state.patient_arrived_apts]
            : [],
      };
    }
    case "UPDATE_CLIN_COORDS": {
      return {
        ...state,
        clincoords: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export const initialClinChatMsgState = {
  chatMessages: null,
  loading: true,
};

// chat messaging

export const ClinicianChatMessageReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGES": {
      return {
        chatMessages: action.payload,
        loading: false,
      };
    }
    case "ADD_MESSAGE": {
      return {
        ...state,
        chatMessages: state.chatMessages
          ? [...state.chatMessages, action.payload]
          : [action.payload],
      };
    }

    default: {
      return state;
    }
  }
};

export const initialPatientChatMsgState = {
  chatMessages: null,
  loading: true,
};

export const PatientChatMessageReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGES": {
      return {
        chatMessages: action.payload,
        loading: false,
      };
    }
    case "ADD_MESSAGE": {
      return {
        ...state,
        chatMessages: state.chatMessages
          ? [...state.chatMessages, action.payload]
          : [action.payload],
      };
    }

    default: {
      return state;
    }
  }
};
