import React from "react";
import useAuthState from "../hooks/useAuthState";
import NavBar from "../components/Navbar";
import Sidebar from "../components/PatientSidebar";
import ClinicianSidebar from "../components/ClinicianSidebar";
import PatientSidebar from "../components/PatientSidebar";
import { connect, messages } from "../services/AptService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClinicianAptContext } from "../context";
import { getAvailablePatients } from "../services/AptService";

function Layout() {
  const { isAuthenticated, userDetails } = useAuthState();
  const { group } = userDetails;
  const [userMessages, setUserMessages] = React.useState([]);
  const { clinicianApts, dispatchClinicianApts } =
    React.useContext(ClinicianAptContext);

  React.useEffect(() => {
    if (group === "clinician") {
      loadAvailablePatients();
    }
  }, [group]);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("msg", message);
      if (message.type === "apt.requested.success") {
        toast.success("Your Appointment has been requested");
      } else if (message.type === "apt.requested.clins") {
        console.log("msg", message);
        dispatchClinicianApts({
          type: "ADD_APPOINTMENT",
          payload: message.data,
        });
        const {
          patient: { first_name, last_name },
        } = message.data;
        toast.info(`${first_name} ${last_name} has requested an appointment`);
      } else if (message.type === "apt.booked.msg") {
        const {
          patient: {
            first_name: patient_first_name,
            last_name: patient_last_name,
          },
          clinician: { first_name: clin_first_name, last_name: clin_last_name },
        } = message.data;
        toast.info(
          `${clin_first_name} ${clin_last_name} has booked an appointment with ${patient_first_name} ${patient_last_name} `
        );
      }
    });
    console.log("websocket connected");
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadAvailablePatients = async () => {
    const { response, isError } = await getAvailablePatients();
    dispatchClinicianApts({ type: "ADD_APPOINTMENTS", payload: response.data });
  };

  return (
    <>
      {group === "clinician" ? (
        <>
          <ClinicianSidebar
            isAuthenticated={isAuthenticated}
            userDetails={userDetails}
          />
        </>
      ) : (
        <>
          <PatientSidebar
            isAuthenticated={isAuthenticated}
            userDetails={userDetails}
          />
        </>
      )}
      <ToastContainer />
    </>
  );
}

export default Layout;
