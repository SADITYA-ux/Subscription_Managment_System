import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

export default function RedirectLoggedIn()
{
    const { user , initialized } = useAuth();

    if(!initialized)
    {
        return null;
    }

    if(user)
    {
        return <Navigate to = "/" replace/>
    }

    return <Outlet/>
}