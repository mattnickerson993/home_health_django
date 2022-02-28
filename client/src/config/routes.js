import Dashboard from "../pages/Dashboard"
import LogIn from "../pages/Login"
import NotFound from "../pages/NotFound"
import Register from "../pages/Register"
import Layout from "../pages/Layout"

export const routes = [
    {
        path:'/',
        component: <Layout/>,
        exact:true,
    },
    {
        path:'/dashboard/',
        component: <Dashboard/>,  
        exact:true,
        private:true,
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
        component:<NotFound/>
    }
]

export default routes