import { useEffect, useState } from "react";
import { getMyPayments } from "../../api/payment.api";

type Payment = {
    id: number;
    subid: number;
    amount: string;
    portal: string;
    status: string;
};

export default function MyPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            try {
                const response = await getMyPayments();
                setPayments(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl font-bold text-slate-900">My Payments</h1>

                {payments.length === 0 ? (
                    <p className="text-gray-500">You don't have any payments yet.</p>
                ) : (
                    <div className="space-y-4">
                        {payments.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div>
                                    <p className="font-semibold text-slate-900">₹{p.amount}</p>
                                    <p className="text-sm capitalize text-slate-500">{p.portal}</p>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        p.status === "Paid"
                                            ? "bg-green-100 text-green-700"
                                            : p.status === "Overdue"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}