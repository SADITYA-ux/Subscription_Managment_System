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
        <nav className="sticky top-0 z-40 border-b border-yellow-200 bg-white">
            <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">

                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 shadow-sm shadow-yellow-300/50">
                        <div className="h-3.5 w-3.5 rounded-full bg-black" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-black">
                        MemberHub
                    </span>
                </Link>

                <div className="hidden items-center gap-2 sm:flex">
                    <Link
                        to="/plans"
                        className="rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-black"
                    >
                        Plans
                    </Link>
                    {user && (
                        <Link
                            to="/subscriptions"
                            className="rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-black"
                        >
                            My Subscription
                        </Link>
                    )}
                </div>

                <div ref={profileRef} className="relative">
                    {user ? (
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black shadow-sm shadow-yellow-300/50 transition hover:bg-yellow-500"
                        >
                            {user.email.charAt(0).toUpperCase()}
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-yellow-50 hover:text-black"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-sm shadow-yellow-300/50 transition hover:bg-yellow-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}

                    {open && user && (
                        <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-xl shadow-slate-900/10">
                            <div className="border-b border-yellow-100 bg-yellow-50 px-5 py-4">
                                <p className="truncate text-sm font-semibold text-black">
                                    {user.email}
                                </p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-yellow-700">
                                    {user.role}
                                </p>
                            </div>

                            {user.role === "Admin" && (
                                <Link
                                    to="/admin/plans"
                                    onClick={() => setOpen(false)}
                                    className="block px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-yellow-50 hover:text-black"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            {user.role === "Staff" && (
                                <Link
                                    to="/staff/clients"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-yellow-50 hover:text-black"
                                >
                                    <span>🧾</span>
                                    Staff Panel
                                </Link>
                            )}

                            <div className="h-px bg-yellow-100" />

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    logout();
                                }}
                                className="block w-full px-5 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
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

