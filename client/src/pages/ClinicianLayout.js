import React from "react";
import ClinicianSidebar from "../components/ClinicianSidebar";
import {
  connect,
  getAptMessages,
  getClinMessages,
  getClinSchedApts,
  messages,
} from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClinicianAptContext, ChatMessageContext } from "../context";
import { getAvailablePatients } from "../services/AptService";

function ClinicianLayout({ isAuthenticated, userDetails }) {
  const { clinicianApts, dispatchClinicianApts, dispatchClinSchedApts } =
    React.useContext(ClinicianAptContext);
  const { clinicianChatMessages, dispatchClinicianChatMessages } =
    React.useContext(ChatMessageContext);

  React.useEffect(() => {
    console.log("loading patients");
    loadAvailablePatients();
    loadScheduledAppointments();
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
      } else if (message.type === "chat.message.created") {
        dispatchClinicianChatMessages({
          type: "ADD_MESSAGE",
          payload: message.data,
        });
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

  const loadScheduledAppointments = async () => {
    const { response, isError } = await getClinSchedApts("SCHEDULED");
    const apt_id = response?.data[0]?.id;
    dispatchClinSchedApts({ type: "ADD_APPOINTMENTS", payload: response.data });
    if (apt_id) {
      const { response, isError } = await getAptMessages(apt_id);
      dispatchClinicianChatMessages({
        type: "ADD_MESSAGES",
        payload: response.data,
      });
    }
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
