import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const adminLinks = [
    { to: "/admin/plans", label: "Plans", icon: "P" },
    { to: "/admin/clients", label: "Clients", icon: "C" },
    { to: "/admin/staff", label: "Staff", icon: "S" },
    { to: "/admin/subscriptions", label: "Subscriptions", icon: "S" },
    { to: "/admin/payments", label: "Payments", icon: "P" },
];


export default function AdminLayout() {
    return (
        <div className="flex flex-1">
            <Sidebar title="Admin Panel" subtitle="Verified access" links={adminLinks} />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}