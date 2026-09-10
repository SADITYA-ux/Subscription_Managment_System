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
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-400"></div>
                <p className="text-sm font-medium text-slate-500">Loading...</p>
            </div>
        </div>
    );
}

if (!plan) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
                <p className="font-medium text-slate-600">Plan not found.</p>
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
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
                <div className="mb-4 inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-700">
                    Checkout
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Confirm your plan
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Review the details before you continue.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="h-2 bg-yellow-400"></div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-yellow-600">
                                Selected plan
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-950">
                                {plan.pname}
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                            ★
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-slate-950 p-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Plan price
                        </p>
                        <p className="mt-1 text-3xl font-bold text-yellow-400">
                            Rs.{plan.price}
                        </p>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Duration</span>
                            <span className="font-semibold text-slate-900">
                                {plan.duration} days
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Starts</span>
                            <span className="font-semibold text-slate-900">
                                {formatDate(startDate)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Ends</span>
                            <span className="font-semibold text-slate-900">
                                {formatDate(endDate)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="font-bold text-slate-950">Total</span>
                            <span className="text-lg font-bold text-slate-950">
                                ₹{plan.price}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/checkout/${plan.id}/pay`)}
                        className="mt-8 w-full rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-yellow-400 shadow-sm transition-all hover:bg-yellow-400 hover:text-slate-950 hover:shadow-md active:scale-[0.98]"
                    >
                        Continue to payment
                    </button>
                </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
                You can review your payment details on the next step.
            </p>
        </div>
    </div>
);


}
