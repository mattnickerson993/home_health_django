export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8003"
    : process.env.REACT_APP_API_URL;

export const api = {
  auth: {
    login: `${baseURL}/auth/log_in/`,
    register: `${baseURL}/auth/sign_up/`,
    activate: `${baseURL}/auth/users/activation/`,
    // getuser: `${baseURL}/auth/users/me/`,
    verify: `${baseURL}/auth/token/verify/`,
    refresh: `${baseURL}/auth/token/refresh/`,
    logout: `${baseURL}/auth/logout/`,
    // resetpassword:`${baseURL}/auth/users/reset_password/`,
    // resetpasswordconfirm:`${baseURL}/auth/users/reset_password_confirm/`,
  },
  appointments: {
    availablePatients: `${baseURL}/api/v1/appointments/available_patients`,
    scheduledApts: (apt_status) =>
      `${baseURL}/api/v1/appointments?status=${apt_status}`,
  },
  messages: {
    aptMessages: (apt_id) =>
      `${baseURL}/api/v1/apt_messages/messages/${apt_id}`,
  },
  //     patients: {
  //         list: `${baseURL}/api/v1/patients/`,
  //         inactivelist: `${baseURL}/api/v1/patients/inactive/`,
  //         create: `${baseURL}/api/v1/patients/create/`,
  //         detail: id => `${baseURL}/api/v1/patients/${id}/`,
  //         update: id => `${baseURL}/api/v1/patients/update/${id}/`,
  //         delete: id => `${baseURL}/api/v1/patients/delete/${id}`,
  //         archive: id => `${baseURL}/api/v1/patients/archive/${id}/`,
  //     },
  //     appointments: {
  //         list: `${baseURL}/api/v1/appointments/`,
  //         archivedlist: `${baseURL}/api/v1/appointments/archived/`,
  //         feedbacklist: `${baseURL}/api/v1/appointments/feedback/`,
  //         thirtyfeedbacklist: `${baseURL}/api/v1/appointments/feedback/thirty/`,
  //         detail: id => `${baseURL}/api/v1/appointments/detail/${id}/`,
  //         create: `${baseURL}/api/v1/appointments/create/`,
  //         delete: id => `${baseURL}/api/v1/appointments/delete/${id}/`,
  //         archive: id => `${baseURL}/api/v1/appointments/archive/${id}/`,
  //         confirm: id => `${baseURL}/api/v1/appointments/confirm/${id}/`,
  //         patientconfirm: `${baseURL}/api/v1/appointments/patient/confirm/`,
  //         doctorreview: id => `${baseURL}/api/v1/appointments/review/${id}/`,
  //         patientreview: `${baseURL}/api/v1/appointments/patient/review/`,
  //         patientfinal: `${baseURL}/api/v1/appointments/patient/final/feedback/`,
  //         doctorfeedback: id => `${baseURL}/api/v1/appointments/doctor/final/feedback/${id}/`,
  //         doctorfeedbackemail: id => `${baseURL}/api/v1/appointments/doctor/feedback/email/${id}/`
  //     }
};
