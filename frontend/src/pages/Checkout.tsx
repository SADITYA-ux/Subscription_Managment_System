import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "../api/plan.api";

type Plan = {
    id: number;
    pname: string;
    duration: number;
    price: string;
};

export default function Checkout() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlan() {
            try {
                const response = await getPlanById(Number(planId));
                setPlan(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPlan();
    }, [planId]);

    if (loading) {
        return (
            <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0b0b0f]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/25 blur-[100px]" />
                    <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/20 blur-[100px] [animation-delay:2s]" />
                </div>

                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative flex h-14 w-14 items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl" />
                        <span className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50" />
                    </div>
                    <p className="text-sm font-medium text-white/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#0b0b0f] px-4">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                    <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                </div>

                <div className="relative animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-6 text-center shadow-2xl shadow-black/50 backdrop-blur-md">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-lg font-black text-black shadow-lg shadow-yellow-500/30">
                        !
                    </div>
                    <p className="font-medium text-white/70">Plan not found.</p>
                </div>
            </div>
        );
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    function formatDate(date: Date) {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-12 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/10 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                        </span>
                        Checkout
                    </div>

                    <h1 className="animate-fade-up text-3xl font-bold tracking-tight text-white [animation-delay:100ms]">
                        Confirm your <span className="text-gradient">plan</span>
                    </h1>

                    <p className="mt-2 animate-fade-up text-sm text-white/50 [animation-delay:200ms]">
                        Review the details before you continue.
                    </p>
                </div>

                <div className="group animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-md transition-all duration-500 [animation-delay:300ms] hover:border-yellow-400/40 hover:shadow-yellow-500/20">
                    <div className="h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                    <div className="relative p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                                    Selected plan
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-white">
                                    {plan.pname}
                                </h2>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-xl text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                                ★
                            </div>
                        </div>

                        <div className="relative mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5">
                            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-400/20 blur-2xl" />
                            <p className="relative text-xs font-medium uppercase tracking-wider text-white/40">
                                Plan price
                            </p>
                            <p className="relative mt-1 text-3xl font-bold text-yellow-400">
                                Rs.{plan.price}
                            </p>
                        </div>

                        <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-white/50">Duration</span>
                                <span className="font-semibold text-white">
                                    {plan.duration} days
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white/50">Starts</span>
                                <span className="font-semibold text-white">
                                    {formatDate(startDate)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-white/50">Ends</span>
                                <span className="font-semibold text-white">
                                    {formatDate(endDate)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <span className="font-bold text-white">Total</span>
                                <span className="text-lg font-bold text-yellow-400">
                                    ₹{plan.price}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/checkout/${plan.id}/pay`)}
                            className="group/btn relative mt-8 w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
                        >
                            <span className="relative z-10">Continue to payment</span>
                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                        </button>
                    </div>
                </div>

                <p className="mt-5 animate-fade-up text-center text-xs text-white/30 [animation-delay:400ms]">
                    You can review your payment details on the next step.
                </p>
            </div>
        </div>
    );
}