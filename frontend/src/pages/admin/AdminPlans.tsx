import { useEffect, useState } from "react";
import { createPlan, deletePlan, getAllPlans, getInactivePlans, restorePlan, updatePlan } from "../../api/plan.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../components/Table";

type Plan = {
    id: number;
    pname: string;
    duration: number;
    price: string;
};

export default function AdminPlan() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ pname: "", duration: "", price: "" });
    const [editPlan, setEditPlan] = useState<Plan | null>(null);
    const [inactivePlans, setInactivePlans] = useState<Plan[]>([]);

    useEffect(() => {
        async function fetchInactive() {
            try {
                const response = await getInactivePlans();
                setInactivePlans(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchInactive();
    }, []);

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

                <div className="relative flex flex-col items-center gap-4">
                    <div className="relative flex h-14 w-14 items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl" />
                        <span className="absolute inset-0 animate-spin rounded-full border-4 border-white/10 border-t-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50" />
                    </div>
                    <p className="text-sm font-medium text-white/60">
                        Loading plans...
                    </p>
                </div>
            </div>
        );
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        const duration = Number(formData.duration);

        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid duration");
            return;
        }

        try {
            await createPlan({
                pname: formData.pname,
                duration: Number(formData.duration),
                price: formData.price
            });

            setShowForm(false);
            setFormData({ pname: "", duration: "", price: "" });

            const response = await getAllPlans();
            setPlans(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function openEditForm(plan: Plan) {
        setEditPlan(plan);
        setFormData({
            pname: plan.pname,
            duration: String(plan.duration),
            price: plan.price
        });
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        if (!editPlan) return;

        const duration = Number(formData.duration);

        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid duration");
            return;
        }

        try {
            await updatePlan(editPlan.id, {
                pname: formData.pname,
                duration: Number(formData.duration),
                price: formData.price
            });

            setEditPlan(null);
            setFormData({ pname: "", duration: "", price: "" });

            const response = await getAllPlans();
            setPlans(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Do you really wanna delete this plan?")) {
            return;
        }

        try {
            await deletePlan(id);

            const [activeRes, inactiveRes] = await Promise.all([
                getAllPlans(),
                getInactivePlans()
            ]);

            setPlans(activeRes.data);
            setInactivePlans(inactiveRes.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRestore(id: number) {
        try {
            await restorePlan(id);

            const [activeRes, inactiveRes] = await Promise.all([
                getAllPlans(),
                getInactivePlans()
            ]);

            setPlans(activeRes.data);
            setInactivePlans(inactiveRes.data);
        } catch (error) {
            console.log(error);
        }
    }

    const inactiveColumns: ColumnDef<any, Plan>[] = [
        {
            accessorKey: "pname",
            header: "Plan Name"
        },
        {
            accessorKey: "duration",
            header: "Duration (Days)"
        },
        {
            accessorKey: "price",
            header: "Price"
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
            )
        }
    ];

    const columns: ColumnDef<any, Plan>[] = [
        {
            accessorKey: "pname",
            header: "Plan Name"
        },
        {
            accessorKey: "duration",
            header: "Duration (Days)"
        },
        {
            accessorKey: "price",
            header: "Price"
        },
        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-1">
                    <button
                        onClick={() => openEditForm(row.original)}
                        className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-yellow-400/15 hover:text-yellow-300 active:scale-95"
                    >
                        <FaEdit size={17} />
                    </button>

                    <button
                        onClick={() => handleDelete(row.original.id)}
                        className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:scale-95"
                    >
                        <FaTrash size={17} />
                    </button>
                </div>
            )
        }
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
                            Manage <span className="text-gradient">Plans</span>
                        </h1>

                        <p className="mt-2 text-sm text-white/50">
                            Create, manage and update your subscription plans.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="group/btn relative inline-flex animate-fade-up items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 [animation-delay:120ms] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg leading-none">+</span>
                            Add Plan
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    </button>
                </div>

                <div className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md [animation-delay:200ms]">
                    <div className="border-b border-white/10 bg-gradient-to-r from-yellow-400/10 to-transparent px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white">
                                    Active Plans
                                </h2>

                                <p className="mt-1 text-xs text-white/50">
                                    Plans currently available to customers.
                                </p>
                            </div>

                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
                                {plans.length} {plans.length === 1 ? "Plan" : "Plans"}
                            </span>
                        </div>
                    </div>

                    <Table<Plan>
                        columns={columns}
                        data={plans}
                        tableKey="admin-plans"
                    />
                </div>

                {(inactivePlans?.length ?? 0) > 0 && (
                    <div className="mt-10 animate-fade-up [animation-delay:300ms]">
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-white">
                                        Deleted Plans
                                    </h2>

                                    <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-2.5 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
                                        {inactivePlans.length}
                                    </span>
                                </div>

                                <p className="mt-1 text-sm text-white/50">
                                    Plans that are currently inactive.
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md">
                            <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
                                <p className="text-sm font-semibold text-white/80">
                                    Inactive Plans
                                </p>
                            </div>

                            <Table<Plan>
                                columns={inactiveColumns}
                                data={inactivePlans}
                                tableKey="inactive-plans"
                            />
                        </div>
                    </div>
                )}

                {(showForm || editPlan) && (
                    <div className="fixed inset-0 z-50 flex animate-fade-up items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#15151c] shadow-2xl shadow-black/60">
                            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                            <form
                                onSubmit={editPlan ? handleUpdate : handleCreate}
                                className="p-6"
                            >
                                <div className="mb-6">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                                        {editPlan ? (
                                            <FaEdit size={16} />
                                        ) : (
                                            <span className="text-xl font-bold">+</span>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-white">
                                        {editPlan ? "Edit Plan" : "Add New Plan"}
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        {editPlan
                                            ? "Update the details of this plan."
                                            : "Enter the details for your new plan."
                                        }
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Plan Name
                                        </label>

                                        <input
                                            name="pname"
                                            placeholder="Plan Name"
                                            value={formData.pname}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Duration
                                        </label>

                                        <input
                                            name="duration"
                                            type="number"
                                            placeholder="Time in days"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Price
                                        </label>

                                        <input
                                            name="price"
                                            placeholder="Money"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>
                                </div>

                                <div className="mt-7 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditPlan(null);
                                            setFormData({
                                                pname: "",
                                                duration: "",
                                                price: ""
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
                                        <span className="relative z-10">
                                            {editPlan ? "Update Plan" : "Create Plan"}
                                        </span>
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