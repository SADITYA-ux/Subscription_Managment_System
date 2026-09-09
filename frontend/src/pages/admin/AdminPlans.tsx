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
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-400" />
                <p className="text-sm font-medium text-slate-500">
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
                className="rounded-lg bg-yellow-100 px-4 py-2 text-xs font-semibold text-black transition hover:bg-yellow-400 active:scale-95"
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
                    className="rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-yellow-100 hover:text-black active:scale-95"
                >
                    <FaEdit size={17} />
                </button>

                <button
                    onClick={() => handleDelete(row.original.id)}
                    className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                    <FaTrash size={17} />
                </button>
            </div>
        )
    }
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
                        Manage Plans
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create, manage and update your subscription plans.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
                >
                    <span className="mr-2 text-lg leading-none">+</span>
                    Add Plan
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-yellow-100 bg-yellow-50/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-black">
                                Active Plans
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Plans currently available to customers.
                            </p>
                        </div>

                        <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-yellow-400">
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
                <div className="mt-10">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-black">
                                    Deleted Plans
                                </h2>

                                <span className="rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-yellow-400">
                                    {inactivePlans.length}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Plans that are currently inactive.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                            <p className="text-sm font-semibold text-slate-700">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-2xl">
                        <div className="h-1.5 bg-yellow-400" />

                        <form
                            onSubmit={editPlan ? handleUpdate : handleCreate}
                            className="p-6"
                        >
                            <div className="mb-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-black">
                                    {editPlan ? (
                                        <FaEdit size={16} />
                                    ) : (
                                        <span className="text-xl font-bold">+</span>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-black">
                                    {editPlan ? "Edit Plan" : "Add New Plan"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editPlan
                                        ? "Update the details of this plan."
                                        : "Enter the details for your new plan."
                                    }
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Plan Name
                                    </label>

                                    <input
                                        name="pname"
                                        placeholder="Plan Name"
                                        value={formData.pname}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Duration
                                    </label>

                                    <input
                                        name="duration"
                                        type="number"
                                        placeholder="Time in days"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Price
                                    </label>

                                    <input
                                        name="price"
                                        placeholder="Money"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
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
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:bg-yellow-300 active:scale-95"
                                >
                                    {editPlan ? "Update Plan" : "Create Plan"}
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