import { getClinSchedApts } from "../services/AptService";
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
    case "USER_LOADED_SUCCESS":
      return {
        ...state,
        userDetails: action.payload,
      };
    case "USER_LOADED_FAIL":
      return {
        ...state,
        userDetails: null,
      };

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

    case "PASSWORD_RESET_SUCCESS": {
      return {
        ...state,
      };
    }

    case "PASSWORD_RESET_FAIL": {
      return {
        ...state,
      };
    }

    case "PASSWORD_RESET_CONFIRM_SUCCESS": {
      return {
        ...state,
      };
    }

    case "PASSWORD_RESET_CONFIRM_FAIL": {
      return {
        ...state,
      };
    }

    case "SIGNUP_SUCCESS": {
      return {
        ...state,
        isAuthenticated: false,
      };
    }

    case "SIGNUP_FAIL": {
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
    }

    case "ACTIVATION_SUCCESS": {
      return {
        ...state,
      };
    }

    case "ACTIVATION_FAIL": {
      return {
        ...state,
      };
    }

    case "UPDATE_ACCESS": {
      return {
        ...state,
      };
    }
    case "RESET_ERROR": {
      return {
        ...state,
        errorMessage: "",
      };
    }
    case "MESSAGE_CLEAR": {
      return {
        ...state,
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

// clinician scheduled apts

export const initClinSchedAptState = {
  clinschedapts: null,
  loading: true,
};

export const ClinSchedAptReducer = (state, action) => {
  switch (action.type) {
    case "ADD_APPOINTMENTS": {
      return {
        clinschedapts: action.payload,
        loading: false,
      };
    }
    case "ADD_APPOINTMENT": {
      return {
        ...state,
        clinschedapts: [action.payload, ...state.clinschedapts],
      };
    }

    default: {
      return state;
    }
  }
};

export const initPatientSchedAptState = {
  patientschedapts: null,
  loading: true,
  clincoords: null,
};

export const PatientSchedAptReducer = (state, action) => {
  switch (action.type) {
    case "ADD_APPOINTMENTS": {
      return {
        patientschedapts: action.payload,
        loading: false,
      };
    }
    case "ADD_APPOINTMENT": {
      return {
        ...state,
        patientschedapts: [action.payload, ...state.patientschedapts],
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
        chatMessages: [...state.chatMessages, action.payload],
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
        chatMessages: [...state.chatMessages, action.payload],
      };
    }

    default: {
      return state;
    }
  }
};
