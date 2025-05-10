import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPassword from "../pages/CheckPassword";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";


const router= createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "register",
                element: <AuthLayouts> <RegisterPage/> </AuthLayouts>
            },
            {
                path: "email",
                element: <AuthLayouts><CheckEmailPage/></AuthLayouts>
            },
            {
                path: "password",
                element: <AuthLayouts><CheckPassword/></AuthLayouts>
            },
            {
                path: "forgot-password",
                element:<AuthLayouts><ForgotPassword/></AuthLayouts>
            },
            {
                path: "",
                element: <Home/>,
                children: [
                    {
                        // userId will be dynamic so added : before it
                        path: ":userId",
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router