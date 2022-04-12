import axios from "axios";
import { share } from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import { api } from "../api";

import { getAccessToken, getUser } from "./authService";

let _socket;
export let messages;

export const connect = () => {
  if (!_socket || _socket.closed) {
    const token = getAccessToken();
    _socket = webSocket(
      `ws://localhost:8003/home_health/appointments/?token=${token}`
    );
    _socket.subscribe();
    messages = _socket.pipe(share());
    // messages.subscribe((message) => console.log(message));
  }
};

export const getAvialableClinicians = () => {
  connect();
  const message = {
    type: "get.clinicians",
  };
  _socket.next(message);
};

export const createApt = (apt) => {
  // connect();
  const message = {
    type: "create.apt",
    data: apt,
  };
  _socket.next(message);
};

export const updateCoords = (coords, apt_id) => {
  console.log("updating");
  const message = {
    type: "update.coords",
    data: {
      coords,
      apt_id,
    },
  };
  _socket.next(message);
};

export const sendNewChatMsg = (msg, apt_id) => {
  const message = {
    type: "create.new_chat_msg",
    data: { appointment: apt_id, content: msg },
  };
  console.log("msg", message);
  _socket.next(message);
};

export const clinBookApt = (apt_id) => {
  const { id: clinician_id } = getUser();
  const message = {
    type: "clin.book.apt",
    data: {
      id: apt_id,
      clinician: clinician_id,
      status: "SCHEDULED",
    },
  };
  _socket.next(message);
};

export const clinBeginNav = (apt_id) => {
  const message = {
    type: "clin.begin.nav",
    data: {
      id: apt_id,
      status: "IN_ROUTE",
    },
  };
  _socket.next(message);
};

export const clinArrival = (apt_id) => {
  const message = {
    type: "clin.arrived",
    data: {
      id: apt_id,
      status: "ARRIVED",
    },
  };
  _socket.next(message);
};

export const clinComplete = (apt_id) => {
  const message = {
    type: "clin.apt.complete",
    data: {
      id: apt_id,
      status: "COMPLETE",
    },
  };
  _socket.next(message);
};
// export const createTrip = (trip) => {
//   connect();
//   const message = {
//     type: "create.trip",
//     data: trip,
//   };
//   _socket.next(message);
// };

// export const getTrip = async (id) => {
//   const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
//   const token = getAccessToken();
//   const headers = { Authorization: `Bearer ${token}` };
//   try {
//     const response = await axios.get(url, { headers });
//     return { response, isError: false };
//   } catch (response) {
//     return { response, isError: true };
//   }
// };

// export const getTrips = async () => {
//   const url = `${process.env.REACT_APP_BASE_URL}/api/trip/`;
//   const token = getAccessToken();
//   const headers = { Authorization: `Bearer ${token}` };
//   try {
//     const response = await axios.get(url, { headers });
//     return { response, isError: false };
//   } catch (response) {
//     return { response, isError: true };
//   }
// };

export const getAvailablePatients = async () => {
  const url = api.appointments.availablePatients;
  const token = getAccessToken();
  const headers = { Authorization: `JWT ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};

export const getAptMessages = async (apt_id) => {
  const url = api.messages.aptMessages(apt_id);
  const token = getAccessToken();
  const headers = { Authorization: `JWT ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};

export const getClinActiveApts = async (status) => {
  const url = api.appointments.activeApts(status);
  const token = getAccessToken();
  const headers = { Authorization: `JWT ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};

export const getPatientActiveApts = async (status) => {
  const url = api.appointments.activeApts(status);
  const token = getAccessToken();
  const headers = { Authorization: `JWT ${token}` };
  try {
    const response = await axios.get(url, { headers });
    return { response, isError: false };
  } catch (response) {
    return { response, isError: true };
  }
};
