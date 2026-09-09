import { useEffect, useState } from "react";
import { getAllPlans } from "../api/plan.api";

type Plan = 
{
    id : number;
    pname : string;
    duration : number;
    price : string;
}

export default function Home()
{
const [plans , setPlans] = useState<Plan[]>([]);

useEffect(() => {
    async function fetchPlan() {
        try {
            const response = await getAllPlans();
            setPlans(response.data.slice(0, 3));
        } catch (error) {
            console.log(error);
        }
    }

    fetchPlan();
}, []);

return (
    <div className="flex-1 overflow-hidden bg-white text-slate-900">
        <section className="relative overflow-hidden bg-yellow-400">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-300/40 blur-3xl" />
            <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-yellow-500/30 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-semibold text-black shadow-sm backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-black" />
                        Simple subscription management
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-black sm:text-6xl lg:text-7xl">
                        Manage your membership.
                        <span className="block text-white">
                            Made simple.
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-black/70">
                        Everything you need to discover plans, manage your
                        subscription, and keep track of your payments — all
                        in one place.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button className="rounded-full bg-black px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-black/90">
                            Explore plans
                        </button>

                        <button className="rounded-full border border-black/10 bg-white px-8 py-4 text-sm font-semibold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-black hover:text-white">
                            Learn more
                        </button>
                    </div>
                </div>

                <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-black">
                            Browse plans
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Explore available plans and choose the one that
                            fits your needs.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-black">
                            Track your status
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            See your subscription status and always know
                            when it renews.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-black">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                    d="M3 10h18M7 15h2m-6 4h18a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-black">
                            Manage payments
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Keep your payment history organized and easy to
                            understand.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {plans.length > 0 && (
            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-yellow-600">
                            Membership
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                            Choose a plan that works for you
                        </h2>

                        <p className="mt-3 max-w-2xl text-slate-500">
                            Flexible options designed to give you exactly
                            what you need.
                        </p>
                    </div>

                    <button className="w-fit text-sm font-semibold text-black transition hover:text-yellow-600">
                        View all plans →
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.id}
                            className={`relative overflow-hidden rounded-2xl border bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                index === 1
                                    ? "border-yellow-300 shadow-lg shadow-yellow-100"
                                    : "border-slate-200 shadow-sm"
                            }`}
                        >
                            {index === 1 && (
                                <div className="absolute right-5 top-5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
                                    Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-black">
                                    {plan.pname}
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    {plan.duration} days
                                </p>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold tracking-tight text-black">
                                    {plan.price}
                                </span>

                                <span className="ml-2 text-sm text-slate-500">
                                    / {plan.duration} days
                                </span>
                            </div>

                            <div className="mb-8 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                                        ✓
                                    </span>
                                    Easy subscription management
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                                        ✓
                                    </span>
                                    Clear payment tracking
                                </div>
                            </div>

                            <button
                                className={`w-full rounded-xl px-5 py-3 text-sm font-semibold transition ${
                                    index === 1
                                        ? "bg-black text-white shadow-md shadow-black/10 hover:bg-yellow-400 hover:text-black"
                                        : "border border-slate-200 bg-white text-black hover:border-yellow-300 hover:bg-yellow-50"
                                }`}
                            >
                                Choose plan
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        )}
    </div>
);
}
