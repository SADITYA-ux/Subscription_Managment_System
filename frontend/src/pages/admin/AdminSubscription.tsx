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
import { useAuth } from "../../components/authContext";

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
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";

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
            const basePromises: [Promise<any>, Promise<any>, Promise<any>] = [
                getAllSubscriptions(),
                getAllPlans(),
                getAllClients(),
            ];

            const [subRes, planRes, clientRes] = await Promise.all(basePromises);

            setSubs(subRes.data);
            setPlans(planRes.data);
            setClients(clientRes.data);

            if (isAdmin) {
                const inactiveRes = await getInactiveSubscriptions();
                setInactiveSubs(inactiveRes.data);
            }
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
                    <p className="text-sm font-medium text-white/60">
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
                        className="rounded-lg bg-yellow-400/15 px-3 py-1.5 text-xs font-semibold text-yellow-300 transition-all duration-300 hover:bg-yellow-400 hover:text-black active:scale-95"
                    >
                        Extend
                    </button>

                    {isAdmin && (
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:scale-95"
                        >
                            <FaTrash size={17} />
                        </button>
                    )}
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
                    className="rounded-lg bg-yellow-400/15 px-4 py-2 text-xs font-semibold text-yellow-300 transition-all duration-300 hover:bg-yellow-400 hover:text-black active:scale-95"
                >
                    Restore
                </button>
            ),
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-8 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/10 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="animate-fade-up">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-yellow-200 backdrop-blur-md">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-400" />
                            </span>
                            Subscription Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Manage <span className="text-gradient">Subscriptions</span>
                        </h1>

                        <p className="mt-2 text-sm text-white/50">
                            Assign plans to clients and track their subscription status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="group/btn relative inline-flex animate-fade-up items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 [animation-delay:120ms] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg leading-none">+</span>
                            New Subscription
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    </button>
                </div>

                <div className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md [animation-delay:200ms]">
                    <div className="border-b border-white/10 bg-gradient-to-r from-yellow-400/10 to-transparent px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white">
                                    Active Subscriptions
                                </h2>

                                <p className="mt-1 text-xs text-white/50">
                                    Currently active client subscriptions.
                                </p>
                            </div>

                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
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

                {isAdmin && (inactiveSubs?.length ?? 0) > 0 && (
                    <div className="mt-10 animate-fade-up [animation-delay:300ms]">
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-white">
                                        Cancelled Subscriptions
                                    </h2>

                                    <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
                                        {inactiveSubs.length}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-white/50">
                                    Subscriptions that are currently inactive.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md">
                            <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
                                <p className="text-sm font-semibold text-white/80">
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
                    <div className="fixed inset-0 z-50 flex animate-fade-up items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#15151c] shadow-2xl shadow-black/60">
                            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                            <form onSubmit={handleCreate} className="p-6">
                                <div className="mb-6">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                                        <span className="text-xl font-bold">+</span>
                                    </div>

                                    <h2 className="text-xl font-bold text-white">
                                        New Subscription
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        Assign a subscription plan to a client.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Client
                                        </label>

                                        <select
                                            name="clientid"
                                            value={formData.clientid}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        >
                                            <option className="bg-[#15151c]" value="">Select client</option>

                                            {clients.map((c) => (
                                                <option className="bg-[#15151c]" key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Plan
                                        </label>

                                        <select
                                            name="planid"
                                            value={formData.planid}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        >
                                            <option className="bg-[#15151c]" value="">Select plan</option>

                                            {plans.map((p) => (
                                                <option className="bg-[#15151c]" key={p.id} value={p.id}>
                                                    {p.pname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Start Date
                                        </label>

                                        <input
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition [color-scheme:dark] focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
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
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                                    >
                                        <span className="relative z-10">Create Subscription</span>
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
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