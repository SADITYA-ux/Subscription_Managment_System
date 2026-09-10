import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const clientLinks = [
    { to: "/my/subscription", label: "My Subscriptions", icon: "S" },
    { to: "/my/payments", label: "My Payments", icon: "P" },
];
export default function ClientLayout() {
    return (
        <div className="flex flex-1">
            <Sidebar title="My Account" subtitle="Member access" links={clientLinks} />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}