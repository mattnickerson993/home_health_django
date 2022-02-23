import Landing from "../pages/Landing"
import LogIn from "../pages/Login"
import NotFound from "../pages/NotFound"
import Register from "../pages/Register"



const routes = [
    {
        path:'/',
        component: <Landing/>,
        exact:true,
    },
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
        component:<NotFound/>,
    }

]


export default routes