import { useEffect, useState } from "react";
import { getAllPlans } from "../api/plan.api";
import { useNavigate } from "react-router-dom";

type Plan = {
id: number;
pname: string;
duration: number;
price: string;
};

export default function Plans() {
const [plans, setPlans] = useState<Plan[]>([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
    async function fetchPlans() {
        try {
            const response = await getAllPlans();
            setPlans(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    fetchPlans();
}, []);

if (loading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="flex flex-col items-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-400" />
                <p className="text-sm font-semibold text-slate-500">
                    Loading plans...
                </p>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                    Membership Plans
                </div>

                <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
                    Choose your plan
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                    Pick the membership that fits you best and get started
                    with the plan that works for you.
                </p>
            </div>

            {plans.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-black">
                        <span className="text-xl font-black">—</span>
                    </div>

                    <p className="text-base font-bold text-black">
                        No plans available
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        There are no membership plans available right now.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-xl"
                        >
                            <div className="h-1.5 w-full bg-yellow-400" />

                            <div className="flex flex-1 flex-col p-7">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-black">
                                            {plan.pname}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {plan.duration} days
                                        </p>
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-sm font-black text-black">
                                        {plan.duration}d
                                    </div>
                                </div>

                                <div className="my-8">
                                    <p className="text-4xl font-black tracking-tight text-black">
                                        Rs.{plan.price}
                                    </p>

                                    <p className="mt-2 text-xs font-medium text-slate-400">
                                        per {plan.duration}-day period
                                    </p>
                                </div>

                                <div className="mt-auto rounded-xl bg-slate-50 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-slate-500">
                                            Duration
                                        </span>

                                        <span className="text-sm font-bold text-black">
                                            {plan.duration} days
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/checkout/${plan.id}`)}
                                    className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black shadow-sm shadow-yellow-300/50 transition hover:bg-yellow-500"
                                >
                                    Choose this plan
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
}
