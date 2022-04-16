export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8003"
    : process.env.REACT_APP_API_URL;

export const api = {
  auth: {
    login: `${baseURL}/auth/log_in/`,
    register: `${baseURL}/auth/sign_up/`,
    verify: `${baseURL}/auth/token/verify/`,
    refresh: `${baseURL}/auth/token/refresh/`,
    logout: `${baseURL}/auth/logout/`,
  },
  appointments: {
    availablePatients: `${baseURL}/api/v1/appointments/available_patients`,
    activeApts: (apt_status) =>
      `${baseURL}/api/v1/appointments?status=${apt_status}`,
    pastApts: `${baseURL}/api/v1/appointments/past/`,
  },
  messages: {
    aptMessages: (apt_id) =>
      `${baseURL}/api/v1/apt_messages/messages/${apt_id}`,
  },
};
