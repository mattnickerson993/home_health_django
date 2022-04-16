import React from "react";
import { AuthContext } from "../context";

function useAuthState() {
  const { state } = React.useContext(AuthContext);
  return {
    ...state,
  };
}

export default useAuthState;
