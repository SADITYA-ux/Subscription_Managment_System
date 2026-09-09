import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";

export default function Register() {
const [formData, setFormData] = useState({
email: "",
password: "",
name: "",
address: "",
number: "",
age: "",
});

const [error, setError] = useState("");
const navigate = useNavigate();

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
}

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
        await registerUser({
            ...formData,
            number: Number(formData.number),
            age: Number(formData.age),
        });

        navigate("/login");
    } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : "Registration failed"
        );
    }
}

return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center">
            <div className="w-full">
                <div className="mb-7 text-center">
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
                        Get Started
                    </div>

                    <h1 className="mt-4 text-3xl font-black tracking-tight text-black">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Join MemberHub and manage your subscription
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
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-bold text-black"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-bold text-black"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-bold text-black"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-bold text-black"
                                >
                                    Address
                                </label>

                                <input
                                    id="address"
                                    name="address"
                                    placeholder="Your address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="number"
                                        className="mb-2 block text-sm font-bold text-black"
                                    >
                                        Phone number
                                    </label>

                                    <input
                                        id="number"
                                        name="number"
                                        type="tel"
                                        placeholder="Phone number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="age"
                                        className="mb-2 block text-sm font-bold text-black"
                                    >
                                        Age
                                    </label>

                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        placeholder="Age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-7 w-full rounded-xl bg-black py-3.5 text-sm font-bold text-yellow-400 shadow-sm transition-all duration-200 hover:bg-yellow-400 hover:text-black active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-200"
                        >
                            Create account
                        </button>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-black transition hover:text-yellow-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>

                <p className="mt-5 text-center text-xs text-slate-400">
                    © 2026 MemberHub. All rights reserved.
                </p>
            </div>
        </div>
    </div>
);

}
