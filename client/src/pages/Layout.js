import React from 'react'
import useAuthState from '../hooks/useAuthState'
import NavBar from '../components/Navbar'

function Layout() {
  const { userDetails, isAuthenticated } = useAuthState()
  
  return (
    <>
      <NavBar auth={isAuthenticated}/>
      <h1>Hello world</h1>
     <div>{isAuthenticated ? 'Auth Layout' : 'Unauth Layout'}</div>
    </>
    
  )
}

export default Layout