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
        <div className="min-h-screen bg-[#F5F6F8] px-4 py-10">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-lg items-center">
                <div className="w-full">

                    <div className="mb-7 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-[#172033]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172554] text-sm font-bold text-white shadow-sm">
                                M
                            </span>

                            Member
                            <span className="text-[#8F3047]">
                                Hub
                            </span>
                        </Link>

                        <h1 className="mt-7 text-3xl font-bold tracking-tight text-[#172033]">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-[#667085]">
                            Join MemberHub and manage your subscription
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-[#E1E5EB] bg-white p-7 shadow-[0_8px_30px_rgba(23,32,51,0.06)] sm:p-8"
                    >
                        {error && (
                            <div className="mb-6 rounded-xl border border-[#E8CDD4] bg-[#F4E7EA] px-4 py-3 text-sm text-[#8F3047]">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-[#344054]"
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
                                    className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-[#344054]"
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
                                    className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-[#344054]"
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
                                    className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-[#344054]"
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
                                    className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label
                                        htmlFor="number"
                                        className="mb-2 block text-sm font-medium text-[#344054]"
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
                                        className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="age"
                                        className="mb-2 block text-sm font-medium text-[#344054]"
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
                                        className="w-full rounded-xl border border-[#D5DAE1] bg-[#F8F9FB] px-4 py-3 text-sm text-[#172033] outline-none transition placeholder:text-[#98A2B3] hover:border-[#B8C0CC] focus:border-[#284B8F] focus:bg-white focus:ring-4 focus:ring-[#284B8F]/10"
                                    />
                                </div>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="mt-7 w-full rounded-xl bg-[#284B8F] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1F3D78] focus:outline-none focus:ring-4 focus:ring-[#284B8F]/20 active:scale-[0.99]"
                        >
                            Create account
                        </button>

                        <p className="mt-6 text-center text-sm text-[#667085]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#8F3047] transition hover:text-[#72263A]"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>

                    <p className="mt-5 text-center text-xs text-[#98A2B3]">
                        © 2026 MemberHub. All rights reserved.
                    </p>

                </div>
            </div>
        </div>
    );
}