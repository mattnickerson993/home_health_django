import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import useAuthState from '../hooks/useAuthState'

// const PrivateRoute = ({component: Component, ...rest}) => {
//     const {isAuthenticated} = useAuthState()
    
//     return (
//         <Route {...rest} render={props => {
//             if (isAuthenticated){
//                 return <Route component={<Component/>} {...props} />
//             }
//             return <Navigate to='/login/' />
//         }} />
//     )
// }

const PrivateRoute = () => {
    const {isAuthenticated} = useAuthState()
    return isAuthenticated ? <Outlet/> : <Navigate to='/login/'/>
    
}

export default PrivateRoute