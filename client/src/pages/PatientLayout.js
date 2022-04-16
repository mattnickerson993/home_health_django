import React from "react";
import PatientSidebar from "../components/PatientSidebar";
import {
  connect,
  getAptMessages,
  getPatientActiveApts,
  messages,
} from "../services/AptService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatMessageContext, PatientAptContext } from "../context";

function PatientLayout({ isAuthenticated, userDetails }) {
  const { dispatchPatientActiveApts } = React.useContext(PatientAptContext);
  const { patientChatMessages, dispatchPatientChatMessages } =
    React.useContext(ChatMessageContext);

  React.useEffect(() => {
    loadActiveAppointment();
  }, []);

  React.useEffect(() => {
    connect();
    const subscription = messages.subscribe((message) => {
      console.log("message type", message.type);
      switch (message.type) {
        case "apt.requested.success": {
          toast.success("Your Appointment has been requested");
          break;
        }
        case "patient.canceled": {
          dispatchPatientActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          toast.success(`Appointment successfully canceled`);
          break;
        }
        case "clin.complete.update": {
          dispatchPatientActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          break;
        }
        case "clin.arrival.update": {
          dispatchPatientActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          const {
            clinician: {
              first_name: clin_first_name,
              last_name: clin_last_name,
            },
          } = message.data;
          toast.info(`${clin_first_name} ${clin_last_name} has arrived!`);
          break;
        }
        case "clin.on.way": {
          dispatchPatientActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          const {
            clinician: {
              first_name: clin_first_name,
              last_name: clin_last_name,
            },
          } = message.data;
          toast.info(`${clin_first_name} ${clin_last_name} is on there way!`);
          break;
        }
        case "update.coords": {
          dispatchPatientActiveApts({
            type: "UPDATE_CLIN_COORDS",
            payload: message.data,
          });
          break;
        }
        case "chat.message.created": {
          dispatchPatientChatMessages({
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
          dispatchPatientActiveApts({
            type: "ADD_APPOINTMENT",
            payload: message.data,
          });
          const {
            clinician: {
              first_name: clin_first_name,
              last_name: clin_last_name,
            },
          } = message.data;
          toast.info(
            `Your appointment has been accepted by ${clin_first_name} ${clin_last_name}`
          );
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

  const loadActiveAppointment = async () => {
    const { response, isError } = await getPatientActiveApts("active");
    console.log("res", response);
    const apt_id = response?.data[0]?.id;
    dispatchPatientActiveApts({
      type: "LOAD_APPOINTMENTS",
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
