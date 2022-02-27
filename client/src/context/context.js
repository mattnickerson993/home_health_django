
import React from "react"

import { initialState, AuthReducer } from "./reducer"


export const AuthContext = React.createContext()


export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(AuthReducer, initialState)
    console.log('context loaded')
    return (
    <AuthContext.Provider value={{ state, dispatch }}>
            {children}
     </AuthContext.Provider>
    )
}
