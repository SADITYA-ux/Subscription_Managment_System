import { useEffect, useRef, useState } from "react";
import { useAuth } from "./authContext";
import { Link } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                <Link to="/" className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-lg font-bold text-slate-900">
                        MemberHub
                    </span>
                </Link>

                <div className="hidden items-center gap-8 sm:flex">
                    <Link to="/plans" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                        Plans
                    </Link>
                    {user && (
                        <Link to="/subscriptions" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                            My Subscription
                        </Link>
                    )}
                </div>

                <div ref={profileRef} className="relative">
                    {user ? (
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            {user.email.charAt(0).toUpperCase()}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {open && user && (
                        <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                            <div className="px-4 py-3">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {user.email}
                                </p>
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    {user.role}
                                </p>
                            </div>

                            <div className="h-px bg-slate-100" />

                            {user.role === "Admin" && (
                                <Link
                                    to="/admin/plans"
                                    onClick={() => setOpen(false)}
                                    className="block px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    logout();
                                }}
                                className="block w-full px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}