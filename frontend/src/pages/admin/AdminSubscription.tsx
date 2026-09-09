import { useEffect, useState } from "react";
import {
getAllSubscriptions,
createSubscription,
deleteSubscription,
extendSubscription,
getInactiveSubscriptions,
restoreSubscription,
} from "../../api/subscription.api";
import { getAllPlans } from "../../api/plan.api";
import { getAllClients } from "../../api/client.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaTrash } from "react-icons/fa";
import Table from "../../components/Table";

type Subscription = {
id: number;
clientid: number;
planid: number;
startDate: string;
endDate: string;
status: string;
};

type Plan = { id: number; pname: string };
type Client = { id: number; name: string };

export default function AdminSubscriptions() {
const [subs, setSubs] = useState<Subscription[]>([]);
const [inactiveSubs, setInactiveSubs] = useState<Subscription[]>([]);
const [plans, setPlans] = useState<Plan[]>([]);
const [clients, setClients] = useState<Client[]>([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
clientid: "",
planid: "",
startDate: "",
});

async function fetchAll() {
    try {
        const [subRes, inactiveRes, planRes, clientRes] = await Promise.all([
            getAllSubscriptions(),
            getInactiveSubscriptions(),
            getAllPlans(),
            getAllClients(),
        ]);

        setSubs(subRes.data);
        setInactiveSubs(inactiveRes.data);
        setPlans(planRes.data);
        setClients(clientRes.data);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    fetchAll();
}, []);

if (loading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-400" />
                <p className="text-sm font-medium text-slate-500">
                    Loading subscriptions...
                </p>
            </div>
        </div>
    );
}

function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
}

async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
        await createSubscription({
            clientid: Number(formData.clientid),
            planid: Number(formData.planid),
            startDate: formData.startDate,
        });

        setShowForm(false);

        setFormData({
            clientid: "",
            planid: "",
            startDate: "",
        });

        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

async function handleDelete(id: number) {
    if (!confirm("Cancel this subscription?")) return;

    try {
        await deleteSubscription(id);
        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

async function handleExtend(id: number) {
    if (!confirm("Extend this subscription by its plan's duration?")) return;

    try {
        await extendSubscription(id);
        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

async function handleRestore(id: number) {
    try {
        await restoreSubscription(id);
        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

function clientName(id: number) {
    return clients.find((c) => c.id === id)?.name ?? id;
}

function planName(id: number) {
    return plans.find((p) => p.id === id)?.pname ?? id;
}

function formatDate(value: unknown) {
    const date = new Date(value as string);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const columns: ColumnDef<any, Subscription>[] = [
    {
        accessorFn: (row) => clientName(row.clientid),
        id: "client",
        header: "Client",
    },
    {
        accessorFn: (row) => planName(row.planid),
        id: "plan",
        header: "Plan",
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ getValue }) => formatDate(getValue()),
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ getValue }) => formatDate(getValue()),
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "Actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-1">
                <button
                    onClick={() => handleExtend(row.original.id)}
                    className="rounded-lg bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-yellow-400 active:scale-95"
                >
                    Extend
                </button>

                <button
                    onClick={() => handleDelete(row.original.id)}
                    className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                    <FaTrash size={17} />
                </button>
            </div>
        ),
    },
];

const inactiveColumns: ColumnDef<any, Subscription>[] = [
    {
        accessorFn: (row) => clientName(row.clientid),
        id: "client",
        header: "Client",
    },
    {
        accessorFn: (row) => planName(row.planid),
        id: "plan",
        header: "Plan",
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ getValue }) => formatDate(getValue()),
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ getValue }) => formatDate(getValue()),
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "Actions",
        header: "Actions",
        cell: ({ row }) => (
            <button
                onClick={() => handleRestore(row.original.id)}
                className="rounded-lg bg-yellow-100 px-4 py-2 text-xs font-semibold text-black transition hover:bg-yellow-400 active:scale-95"
            >
                Restore
            </button>
        ),
    },
];

return (
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        Subscription Management
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Manage Subscriptions
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Assign plans to clients and track their subscription status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
                >
                    <span className="mr-2 text-lg leading-none">+</span>
                    New Subscription
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-yellow-100 bg-yellow-50/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-black">
                                Active Subscriptions
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Currently active client subscriptions.
                            </p>
                        </div>

                        <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-yellow-400">
                            {subs.length}{" "}
                            {subs.length === 1 ? "Subscription" : "Subscriptions"}
                        </span>
                    </div>
                </div>

                <Table<Subscription>
                    columns={columns}
                    data={subs}
                    tableKey="admin-subs"
                />
            </div>

            {(inactiveSubs?.length ?? 0) > 0 && (
                <div className="mt-10">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-black">
                                    Cancelled Subscriptions
                                </h2>

                                <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-yellow-400">
                                    {inactiveSubs.length}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Subscriptions that are currently inactive.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <p className="text-sm font-semibold text-slate-700">
                                Inactive Subscriptions
                            </p>
                        </div>

                        <Table<Subscription>
                            columns={inactiveColumns}
                            data={inactiveSubs}
                            tableKey="inactive-subs"
                        />
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-2xl">
                        <div className="h-1.5 bg-yellow-400" />

                        <form onSubmit={handleCreate} className="p-6">
                            <div className="mb-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-black">
                                    <span className="text-xl font-bold">+</span>
                                </div>

                                <h2 className="text-xl font-bold text-black">
                                    New Subscription
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Assign a subscription plan to a client.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Client
                                    </label>

                                    <select
                                        name="clientid"
                                        value={formData.clientid}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="">Select client</option>

                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Plan
                                    </label>

                                    <select
                                        name="planid"
                                        value={formData.planid}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="">Select plan</option>

                                        {plans.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.pname}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Start Date
                                    </label>

                                    <input
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>
                            </div>

                            <div className="mt-7 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({
                                            clientid: "",
                                            planid: "",
                                            startDate: "",
                                        });
                                    }}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:bg-yellow-300 active:scale-95"
                                >
                                    Create Subscription
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    </div>
);

}