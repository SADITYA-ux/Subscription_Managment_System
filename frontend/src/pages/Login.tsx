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
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-12 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
            <div className="w-full">
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-black"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-sm font-black text-black shadow-sm">
                            M
                        </span>

                        Member
                        <span className="text-yellow-500">
                            Hub
                        </span>
                    </Link>

                    <div className="mt-7 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                        Welcome Back
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight text-black">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to manage your subscription
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
                >
                    <div className="h-1.5 w-full bg-yellow-400" />

                    <div className="p-7 sm:p-8">
                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-bold text-black"
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-bold text-black"
                                    >
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-bold text-slate-500 transition hover:text-black"
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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-7 w-full rounded-xl bg-black py-3.5 text-sm font-bold text-yellow-400 shadow-sm transition-all duration-200 hover:bg-yellow-400 hover:text-black active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-200"
                        >
                            Sign in
                        </button>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-bold text-black transition hover:text-yellow-500"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    © 2026 MemberHub. All rights reserved.
                </p>
            </div>
        </div>
    </div>
);


}
