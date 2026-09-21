import { useState } from "react";
import { useAuth } from "../components/authContext";
import { loginUser } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";

export default function DynamicForm({}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const response = await loginUser(email, password);

            login(response.token, response.user);

            navigate("/");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Login failed"
            );
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-12 sm:px-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/25 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/20 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/15 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
                <div className="w-full">
                    <div className="mb-8 text-center">
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-3"
                        >
                            <div className="relative flex h-11 w-11 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                                <span className="absolute inset-0 rotate-45 rounded-2xl border border-yellow-400/30 transition-transform duration-700 group-hover:rotate-[135deg]" />
                                <span className="absolute inset-1 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/40" />
                                <span className="relative text-sm font-black text-black">M</span>
                                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-ping rounded-full bg-yellow-400" />
                                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-yellow-400" />
                            </div>

                            <span className="flex flex-col items-start leading-none">
                                <span className="bg-gradient-to-r from-white via-yellow-100 to-yellow-300 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                                    MemberHub
                                </span>
                                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-yellow-400/60 transition-colors duration-300 group-hover:text-yellow-400">
                                    Premium Access
                                </span>
                            </span>
                        </Link>

                        <div className="mt-7 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                            </span>
                            Welcome Back
                        </div>

                        <h1 className="mt-4 animate-fade-up text-3xl font-black tracking-tight text-white [animation-delay:100ms]">
                            Welcome{" "}
                            <span className="text-gradient">back</span>
                        </h1>

                        <p className="mt-2 animate-fade-up text-sm text-white/50 [animation-delay:200ms]">
                            Sign in to manage your subscription
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-md [animation-delay:300ms]"
                    >
                        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                        <div className="p-7 sm:p-8">
                            {error && (
                                <div className="mb-6 animate-pop rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 backdrop-blur-sm">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-bold text-white/80"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="text-sm font-bold text-white/80"
                                        >
                                            Password
                                        </label>

                                        <button
                                            type="button"
                                            className="text-xs font-bold text-white/50 transition hover:text-yellow-300"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="group/btn relative mt-7 w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
                            >
                                <span className="relative z-10">Sign in</span>
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                            </button>

                            <p className="mt-6 text-center text-sm text-white/50">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-bold text-yellow-400 transition hover:text-yellow-300"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-xs text-white/30">
                        © 2026 MemberHub. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}