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
    const [formData, setFormData] = useState({ clientid: "", planid: "", startDate: "" });

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
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        );
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
            setFormData({ clientid: "", planid: "", startDate: "" });
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
        { accessorFn: (row) => clientName(row.clientid), id: "client", header: "Client" },
        { accessorFn: (row) => planName(row.planid), id: "plan", header: "Plan" },
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
        { accessorKey: "status", header: "Status" },
        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleExtend(row.original.id)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                    >
                        Extend
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                        <FaTrash size={17} />
                    </button>
                </div>
            ),
        },
    ];

    const inactiveColumns: ColumnDef<any, Subscription>[] = [
        { accessorFn: (row) => clientName(row.clientid), id: "client", header: "Client" },
        { accessorFn: (row) => planName(row.planid), id: "plan", header: "Plan" },
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
        { accessorKey: "status", header: "Status" },
        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <button
                    onClick={() => handleRestore(row.original.id)}
                    className="rounded-lg bg-green-100 px-3 py-1 text-xs text-green-800 hover:bg-green-200"
                >
                    Restore
                </button>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Manage Subscriptions
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Assign plans to clients and track their status.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + New Subscription
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <Table<Subscription> columns={columns} data={subs} tableKey="admin-subs" />
                </div>

                {(inactiveSubs?.length ?? 0) > 0 && (
                    <div className="mt-8">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Cancelled Subscriptions
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Subscriptions that are currently inactive.
                                </p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {inactiveSubs.length}{" "}
                                {inactiveSubs.length === 1 ? "Subscription" : "Subscriptions"}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <Table<Subscription>
                                columns={inactiveColumns}
                                data={inactiveSubs}
                                tableKey="inactive-subs"
                            />
                        </div>
                    </div>
                )}

                {showForm  && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <form onSubmit={handleCreate}>
                                <h2 className="mb-6 text-xl font-bold text-gray-900">
                                    New Subscription
                                </h2>

                                <div className="space-y-5">

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Plan:
                                        </label>
                                        <select
                                            name="planid"
                                            value={formData.planid}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        >
                                            <option value="">Select plan</option>
                                            {plans.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.pname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>

                                <div className="mt-7 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setFormData({ clientid: "", planid: "", startDate: "" });
                                        }}
                                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        Create
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