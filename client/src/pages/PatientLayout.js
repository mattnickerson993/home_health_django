import React from "react";
import PatientSidebar from "../components/PatientSidebar";
import {
  connect,
  getAptMessages,
  getPatientSchedApts,
  messages,
} from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatMessageContext, PatientAptContext } from "../context";

function PatientLayout({ isAuthenticated, userDetails }) {
  const { dispatchPatientSchedApts } = React.useContext(PatientAptContext);
  const { patientChatMessages, dispatchPatientChatMessages } =
    React.useContext(ChatMessageContext);
  console.log("patient layout rendered ");
  React.useEffect(() => {
    console.log("loading appointments");
    loadScheduledAppointments();
  }, []);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("msg", message);
      if (message.type === "apt.requested.success") {
        toast.success("Your Appointment has been requested");
      } else if (message.type === "chat.message.created") {
        dispatchPatientChatMessages({
          type: "ADD_MESSAGE",
          payload: message.data,
        });
      } else if (message.type === "apt.requested.fail") {
        toast.error(`${message.msg}`);
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

  const loadScheduledAppointments = async () => {
    const { response, isError } = await getPatientSchedApts("SCHEDULED");
    const apt_id = response?.data[0]?.id;
    dispatchPatientSchedApts({
      type: "ADD_APPOINTMENTS",
      payload: response.data,
    });
    if (apt_id) {
      const { response, isError } = await getAptMessages(apt_id);
      dispatchPatientChatMessages({
        type: "ADD_MESSAGES",
        payload: response.data,
      });
    }
  };

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
