import React from 'react'
import useAuthState from '../hooks/useAuthState'


function Layout() {
  const { userDetails, isAuthenticated } = useAuthState()
  console.log('heres layout')
  return (
    <>
      <h1>Hello world</h1>
     <div>{isAuthenticated ? 'Auth Layout' : 'Unauth Layout'}</div>
    </>
    
  )
}

export default Layout