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
        <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur-xl">
            <div className="flex h-[72px] items-center justify-between px-6 lg:px-10">

                <Link to="/" className="group flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                        <span className="absolute inset-0 rotate-45 rounded-2xl border border-yellow-400/30 transition-transform duration-700 group-hover:rotate-[135deg]" />
                        <span className="absolute inset-1 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/40" />
                        <span className="relative flex h-full w-full items-center justify-center">
                            <span className="h-3 w-3 rounded-full bg-black shadow-inner" />
                            <span className="absolute h-5 w-5 rounded-full border-2 border-black/20 transition-transform duration-700 group-hover:scale-125" />
                        </span>
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-yellow-400" />
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-yellow-400" />
                    </div>

                    <span className="flex flex-col leading-none">
                        <span className="bg-gradient-to-r from-white via-yellow-100 to-yellow-300 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                            MemberHub
                        </span>
                        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-yellow-400/60 transition-colors duration-300 group-hover:text-yellow-400">
                            Premium Access
                        </span>
                    </span>
                </Link>

                <div className="hidden items-center gap-1 sm:flex">
                    <Link
                        to="/plans"
                        className="relative rounded-lg px-5 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:text-yellow-300"
                    >
                        <span className="relative z-10">Plans</span>
                        <span className="absolute inset-x-3 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-yellow-400 to-amber-500 transition-transform duration-300 hover:scale-x-100" />
                    </Link>
                    {user && (
                        <Link
                            to="/aboutUs"
                            className="relative rounded-lg px-5 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:text-yellow-300"
                        >
                            <span className="relative z-10">About Us</span>
                            <span className="absolute inset-x-3 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-yellow-400 to-amber-500 transition-transform duration-300 hover:scale-x-100" />
                        </Link>
                    )}
                    <Link
                        to="/contact"
                        className="relative rounded-lg px-5 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:text-yellow-300"
                    >
                        <span className="relative z-10">Contact Us</span>
                        <span className="absolute inset-x-3 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-yellow-400 to-amber-500 transition-transform duration-300 hover:scale-x-100" />
                    </Link>
                </div>

                <div ref={profileRef} className="relative">
                    {user ? (
                        <button
                            onClick={() => setOpen(!open)}
                            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-yellow-500/50"
                        >
                            <span className="relative z-10">
                                {user.email.charAt(0).toUpperCase()}
                            </span>
                            <span className="absolute inset-0 rounded-full bg-yellow-400/40 blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-yellow-300"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50"
                            >
                                <span className="relative z-10">Sign up</span>
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                            </Link>
                        </div>
                    )}

                    {open && user && (
                        <div className="absolute right-0 top-14 w-60 origin-top-right animate-pop overflow-hidden rounded-2xl border border-white/10 bg-[#15151c]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
                            <div className="border-b border-white/10 bg-gradient-to-br from-yellow-400/10 to-transparent px-5 py-4">
                                <p className="truncate text-sm font-semibold text-white">
                                    {user.email}
                                </p>
                                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-yellow-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                                    {user.role}
                                </p>
                            </div>

                            {user.role === "Admin" && (
                                <Link
                                    to="/admin/plans"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-yellow-400/10 hover:pl-6 hover:text-yellow-300"
                                >
                                    <span>⚙️</span>
                                    Admin Panel
                                </Link>
                            )}

                            {user.role === "Staff" && (
                                <Link
                                    to="/staff/clients"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-yellow-400/10 hover:pl-6 hover:text-yellow-300"
                                >
                                    <span>🧾</span>
                                    Staff Panel
                                </Link>
                            )}

                            {user.role === "Client" && (
                                <Link
                                    to="/my/subscription"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-yellow-400/10 hover:pl-6 hover:text-yellow-300"
                                >
                                    <span>👨🏻‍💼</span>
                                    Client Panel
                                </Link>
                            )}

                            <div className="h-px bg-white/10" />

                            <button
                                onClick={() => {
                                    setOpen(false);
                                    logout();
                                }}
                                className="flex w-full items-center gap-2 px-5 py-3 text-left text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:pl-6 hover:text-red-300"
                            >
                                <span>⏻</span>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}