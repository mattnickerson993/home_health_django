import axios from "axios";
import React from "react";
import { api } from "../api";
import LogIn from "../pages/Login";
import { getRefreshToken, setLocalStorage } from "../utils/storage";

import { initialState, AuthReducer } from "./reducer";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState);

  // const verifyUser = async() => {
  //     const refreshToken = getRefreshToken()
  //     if (refreshToken){
  //         const res = await axios.post(api.auth.refresh, {'refresh': refreshToken})
  //         if (res.status === 200){
  //             setLocalStorage(res.data)
  //             dispatch({
  //                 'type': "AUTHENTICATED_SUCCESS"
  //             })
  //         }
  //         else{
  //             dispatch({
  //               'type': "AUTHENTICATED_FAIL"
  //           })
  //         }
  //     }
  //     else{
  //         dispatch({
  //           'type': "AUTHENTICATED_FAIL"
  //       })
  //     }

  //     }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
