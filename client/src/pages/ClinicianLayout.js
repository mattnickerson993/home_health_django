import React from "react";
import ClinicianSidebar from "../components/ClinicianSidebar";
import { connect, messages } from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClinicianAptContext } from "../context";
import { getAvailablePatients } from "../services/AptService";

function ClinicianLayout({ isAuthenticated, userDetails }) {
  const { clinicianApts, dispatchClinicianApts } =
    React.useContext(ClinicianAptContext);

  React.useEffect(() => {
    console.log("loading patients");
    loadAvailablePatients();
  }, []);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      if (message.type === "apt.requested.clins") {
        dispatchClinicianApts({
          type: "ADD_APPOINTMENT",
          payload: message.data,
        });
        const {
          patient: { first_name, last_name },
        } = message.data;
        toast.info(`${first_name} ${last_name} has requested an appointment`);
      } else if (message.type === "apt.requested.fail") {
        toast.error(`${message.msg}`);
      } else if (message.type === "apt.booked.msg") {
        const {
          patient: {
            first_name: patient_first_name,
            last_name: patient_last_name,
          },
          id: apt_id,
        } = message.data;
        dispatchClinicianApts({
          type: "REMOVE_APPOINTMENT",
          payload: { id: apt_id },
        });
        toast.info(
          `Your appointment has been booked an appointment with ${patient_first_name} ${patient_last_name} `
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

  const loadAvailablePatients = async () => {
    const { response, isError } = await getAvailablePatients();
    dispatchClinicianApts({ type: "ADD_APPOINTMENTS", payload: response.data });
  };

  return (
    <>
      <ClinicianSidebar
        isAuthenticated={isAuthenticated}
        userDetails={userDetails}
      />
    </>
  );
}

export default ClinicianLayout;
