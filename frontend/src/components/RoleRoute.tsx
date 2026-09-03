import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authContext";

type RoleRouteProps =
{
    allowedRoles : string[];
};

export default function RoleRoute({allowedRoles} : RoleRouteProps)
{
    const {user , initialized} = useAuth();

    if(!initialized)
    {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if(!user)
    {
        return < Navigate to = "/login" replace />
    }

    if(!allowedRoles.includes(user.role))
    {
        return< Navigate to = "/" replace />
    }

    return <Outlet/>;
}