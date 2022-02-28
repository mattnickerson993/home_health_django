import axios from "axios"
import React from "react"
import { api } from "../api"
import LogIn from "../pages/Login"
import { getRefreshToken, setLocalStorage } from "../utils/storage"

import { initialState, AuthReducer } from "./reducer"

export const AuthContext = React.createContext()


export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(AuthReducer, initialState)
    const loading  = state.loading
    console.log('loading context', state)
    const verifyUser = async() => {
        const refreshToken = getRefreshToken()
        if (refreshToken){
            const res = await axios.post(api.auth.refresh, {'refresh': refreshToken})
            if (res.status === 200){
                setLocalStorage(res.data)
                dispatch({
                    'type': "AUTHENTICATED_SUCCESS"
                })
            }
            else{
                dispatch({
                  'type': "AUTHENTICATED_FAIL"
              })
            }
        }
        else{
            dispatch({
              'type': "AUTHENTICATED_FAIL"
          })
        }
    
        }
      if(!loading){
          console.log('im not loading')
      }
      React.useEffect(() =>{
        if(loading){
            console.log('verify user called')
            verifyUser()
        }
      },[])

    return (
    <AuthContext.Provider value={{ state, dispatch }}>
        {loading ? null : children}
     </AuthContext.Provider>
    )
}
