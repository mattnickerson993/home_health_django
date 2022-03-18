import React from "react";
import PatientSidebar from "../components/PatientSidebar";
import { connect, messages } from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PatientLayout({ isAuthenticated, userDetails }) {
  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("msg", message);
      if (message.type === "apt.requested.success") {
        toast.success("Your Appointment has been requested");
      } else if (message.type === "apt.booked.msg") {
        const {
          clinician: { first_name: clin_first_name, last_name: clin_last_name },
        } = message.data;
        toast.info(
          `Your appointment has been accepted by ${clin_first_name} ${clin_last_name}`
        );
      }
    });
    console.log("websocket connected");
    return () => {
      if (subscription) {
        console.log("unsubscribed from ws");
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <PatientSidebar
        isAuthenticated={isAuthenticated}
        userDetails={userDetails}
      />
    </>
  );
}

export default PatientLayout;
