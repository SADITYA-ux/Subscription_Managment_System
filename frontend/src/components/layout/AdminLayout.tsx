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
        <div className="flex flex-1 overflow-hidden bg-[#0b0b0f]">
            <Sidebar title="Admin Panel" subtitle="Verified access" links={adminLinks} />

            <main className="relative flex-1 overflow-y-auto p-6">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-40 -top-40 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-400/10 blur-[100px]" />
                    <div className="absolute -bottom-40 -left-40 h-[24rem] w-[24rem] animate-blob rounded-full bg-amber-500/10 blur-[100px] [animation-delay:3s]" />
                </div>

                <div className="relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}