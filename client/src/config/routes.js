import Dashboard from "../pages/Dashboard";
import LogIn from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Layout from "../pages/Layout";
import ClinicianActiveApts from "../components/clinician/ClinicianActiveApt";
import ClinPastApts from "../components/clinician/ClinPastApts";
import ClinChat from "../components/clinician/ClinChat";
import PatientActApts from "../components/patient/PatientActApts";
import PatientPstApts from "../components/patient/PatientPstApt";
import PatientChat from "../components/patient/PatientChat";

export const routes = [
  //   {
  //     path: "/",
  //     component: <Layout />,
  //     exact: true,
  //   },
  {
    path: "/clinician_active_apts",
    component: <ClinicianActiveApts />,
    exact: true,
  },
  {
    path: "/clinician_past_apts",
    component: <ClinPastApts />,
    exact: true,
  },
  {
    path: "/clinician_chat",
    component: <ClinChat />,
    exact: true,
  },
  {
    path: "/patient_my_apts",
    component: <PatientActApts />,
    exact: true,
  },
  {
    path: "patient_my_past_apts",
    component: <PatientPstApts />,
    exact: true,
  },
  {
    path: "patient_chat",
    component: <PatientChat />,
    exact: true,
  },
  //   {
  //     path: "/dashboard/",
  //     component: <Dashboard />,
  //     exact: true,
  //     private: true,
  //   },
  //   {
  //     path: "/login/",
  //     component: <LogIn />,
  //   },
  //   {
  //     path: "/register/",
  //     component: <Register />,
  //   },
  {
    path: "*",
    component: <NotFound />,
  },
];

export default routes;
