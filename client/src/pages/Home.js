import React from "react"
import verifyUser from "../auth/verifyUser"
import useAuthState from "../hooks/useAuthState"
import AuthenticatedApp from "./AuthenticatedApp"
import Layout from "./Layout"
import NoAuthLayout from "./NoAuthLayout"
import UnauthenticatedApp from "./UnauthenticateApp"

function Home() {
    console.log('home loaded')
    const {userDetails, isAuthenticated } = useAuthState()
    return isAuthenticated ? <AuthenticatedApp/> : <UnauthenticatedApp/>
  }

export default Home