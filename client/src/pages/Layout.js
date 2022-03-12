import React from "react";
import useAuthState from "../hooks/useAuthState";
import NavBar from "../components/Navbar";
import Sidebar from "../components/PatientSidebar";
import ClinicianSidebar from "../components/ClinicianSidebar";
import PatientSidebar from "../components/PatientSidebar";
import { connect, messages } from "../services/AptService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { elementAcceptingRef } from "@mui/utils";

function Layout() {
  const { isAuthenticated, userDetails } = useAuthState();
  const { group } = userDetails;
  const [userMessages, setUserMessages] = React.useState([]);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("msg", message);
      if (message.type === "apt.requested.success") {
        toast.success("Your Appointment has been requested");
      } else if (message.type === "apt.requested.clins") {
        const {
          patient: { first_name, last_name },
        } = message.data;
        toast.info(`${first_name} ${last_name} has requested an appointment`);
      }
    });
    console.log("websocket connected");
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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
