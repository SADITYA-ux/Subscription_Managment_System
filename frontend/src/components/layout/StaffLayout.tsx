
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const staffLinks = [
    { to: "/staff/clients", label: "Clients", icon: "C" },
    { to: "/staff/subscriptions", label: "Subscriptions", icon: "S" },
    { to: "/staff/payments", label: "Payments", icon: "P" },
];

export default function StaffLayout() {
    return (
        <div className="flex flex-1">
            <Sidebar title="Staff Panel" subtitle="Staff access" links={staffLinks} />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}