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
            <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0b0b0f]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/25 blur-[100px]" />
                    <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/20 blur-[100px] [animation-delay:2s]" />
                </div>

                <div className="relative flex flex-col items-center">
                    <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl" />
                        <span className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50" />
                    </div>
                    <p className="text-sm font-semibold text-white/60">
                        Loading plans...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-14 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/10 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-14 text-center">
                    <div className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                        </span>
                        Membership Plans
                    </div>

                    <h1 className="animate-fade-up text-4xl font-black tracking-tight text-white sm:text-5xl [animation-delay:100ms]">
                        Choose your{" "}
                        <span className="text-gradient">plan</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl animate-fade-up text-sm leading-6 text-white/50 sm:text-base [animation-delay:200ms]">
                        Pick the membership that fits you best and get started
                        with the plan that works for you.
                    </p>
                </div>

                {plans.length === 0 ? (
                    <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center shadow-2xl shadow-black/50 backdrop-blur-md">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                            <span className="text-xl font-black">—</span>
                        </div>

                        <p className="text-base font-bold text-white">
                            No plans available
                        </p>

                        <p className="mt-1 text-sm text-white/50">
                            There are no membership plans available right now.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className="group relative flex animate-fade-up flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/50 hover:bg-white/[0.05] hover:shadow-yellow-500/20"
                            >
                                <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                                <div className="relative flex flex-1 flex-col p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-yellow-300">
                                                {plan.pname}
                                            </h2>

                                            <p className="mt-1 text-sm text-white/40 transition-colors duration-300 group-hover:text-white/60">
                                                {plan.duration} days
                                            </p>
                                        </div>

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-sm font-black text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                                            {plan.duration}d
                                        </div>
                                    </div>

                                    <div className="my-8">
                                        <p className="text-4xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-yellow-300">
                                            Rs.{plan.price}
                                        </p>

                                        <p className="mt-2 text-xs font-medium text-white/40">
                                            per {plan.duration}-day period
                                        </p>
                                    </div>

                                    <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-white/50">
                                                Duration
                                            </span>

                                            <span className="text-sm font-bold text-white">
                                                {plan.duration} days
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/checkout/${plan.id}`)}
                                        className="group/btn relative mt-6 w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-[0.98]"
                                    >
                                        <span className="relative z-10">Choose this plan</span>
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
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