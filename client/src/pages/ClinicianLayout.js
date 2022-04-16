import React from "react";
import ClinicianSidebar from "../components/ClinicianSidebar";
import {
  connect,
  getAptMessages,
  getClinMessages,
  getClinActiveApts,
  messages,
} from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClinicianAptContext, ChatMessageContext } from "../context";
import { getAvailablePatients } from "../services/AptService";

function ClinicianLayout({ isAuthenticated, userDetails }) {
  const { clinicianApts, dispatchClinicianApts, dispatchClinActiveApts } =
    React.useContext(ClinicianAptContext);
  const { clinicianChatMessages, dispatchClinicianChatMessages } =
    React.useContext(ChatMessageContext);

  React.useEffect(() => {
    loadAvailablePatients();
    loadActiveAppointments();
  }, []);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("msg type", message.type);
      switch (message.type) {
        case "apt.requested.clins": {
          dispatchClinicianApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          const {
            patient: { first_name, last_name },
          } = message.data;
          toast.info(`${first_name} ${last_name} has requested an appointment`);
          break;
        }
        case "patient.canceled": {
          dispatchClinActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          const {
            patient: { first_name, last_name },
          } = message.data;
          toast.info(`${first_name} ${last_name} canceled there appointment`);
          break;
        }
        case "clin.on.way": {
          dispatchClinActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          break;
        }
        case "clin.arrival.update": {
          dispatchClinActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          break;
        }
        case "clin.complete.update": {
          dispatchClinActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          break;
        }
        case "chat.message.created": {
          dispatchClinicianChatMessages({
            type: "ADD_MESSAGE",
            payload: message.data,
          });
          break;
        }
        case "apt.requested.fail": {
          toast.error(`${message.msg}`);
          break;
        }
        case "apt.booked.msg": {
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
          dispatchClinActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          toast.info(
            `Your appointment has been booked with ${patient_first_name} ${patient_last_name} `
          );
          break;
        }
        case "update.coords": {
          break;
        }
        default:
          break;
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

  const loadActiveAppointments = async () => {
    const { response, isError } = await getClinActiveApts("ACTIVE");
    const apt_id = response?.data[0]?.id;
    dispatchClinActiveApts({
      type: "ADD_APPOINTMENTS",
      payload: response.data,
    });
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
