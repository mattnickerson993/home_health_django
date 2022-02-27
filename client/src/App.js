
import React from 'react'
import { api } from './api';
import axiosInstance from './auth/axiosInstance';
import { AuthContext, AuthProvider } from './context';
import {
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Home from './pages/Home';
import { getAccessToken } from './utils/storage';

function App() {
  const {state, dispatch} = React.useContext(AuthContext)
  const isAuthenticated = state ? state.isAuthenticated : false
  console.log('app loading')
  React.useEffect(() =>{
    // define async function to check auth
    const verifyUser = async() => {
        const accessToken = getAccessToken()
        if (accessToken){
            const res = await axiosInstance.post(api.auth.verify, {'token': accessToken})
            console.log('res', res)
            if (res.status === 200){
                return true
            }
    
        }
          return false
      }
      // call async function inside useeffect
      if(!isAuthenticated){
        verifyUser().then(resp =>{
          if(resp){
              dispatch({
                  'type': "AUTHENTICATED_SUCCESS"
              })
          }
          else{
              dispatch({
                'type': "AUTHENTICATED_FAIL"
            })
          }
        }).catch(error => {
          console.log(error)
          dispatch({
            'type': "AUTHENTICATED_FAIL"
          })
        })
      }
      console.log('useffect finished in app')
  },[])
  console.log('app loaded')
  return (
    <>  
    <Router>
      <Routes>
        <Home/>
      </Routes>
    </Router>
    </>
  );
}

export default App;