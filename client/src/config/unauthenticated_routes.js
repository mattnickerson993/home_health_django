import Home from "../pages/Home"
import LogIn from "../pages/Login"
import NoAuthLayout from "../pages/NoAuthLayout"
import NotFound from "../pages/NotFound"
import Register from "../pages/Register"

export const unauthenticateRoutes = [
    {
        path:'/login/',
        component: <LogIn/>,
    },
    {
        path:'/register/',
        component:<Register/>
    },
    {
        path:'*',
        component:<NotFound/>
    }
]