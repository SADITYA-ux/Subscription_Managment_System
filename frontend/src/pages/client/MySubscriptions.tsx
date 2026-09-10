import { useEffect, useState } from "react";
import { getMySubscriptions } from "../../api/subscription.api";

type subs =
{
    id : number;
    planid : number;
    startDate : string;
    endDate : string;
    status : string;
}

export default function MySubscription()
{
    const [subs , setSubs] = useState<subs[]>([]);
    const [loading] = useState(false);

    useEffect( () =>
    {
        async function fetchSubs()
        {
           try
           {
                const response = await getMySubscriptions();
                setSubs(response.data);
           }catch(error)
           {
            console.log(error);
           }
        }
        fetchSubs()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        );
    }

    function formatDate(value: string) {
        return new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl font-bold text-slate-900">My Subscription</h1>

                {subs.length === 0 ? (
                    <p className="text-gray-500">You don't have any subscriptions yet.</p>
                ) : (
                    <div className="space-y-4">
                        {subs.map((sub) => (
                            <div
                                key={sub.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            sub.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : sub.status === "Expired"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {sub.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {formatDate(sub.startDate)} — {formatDate(sub.endDate)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}