import { useEffect, useState } from "react";
import { getAllPayments, createPayment, updatePayment } from "../../api/payment.api";
import { getAllSubscriptions } from "../../api/subscription.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit } from "react-icons/fa";
import Table from "../../components/Table";
import { getAllPlans } from "../../api/plan.api";
import { getAllClients } from "../../api/client.api";

type Payment = {
id: number;
subid: number;
amount: string;
portal: string;
accountno: string | null;
status: string;
};

type plan = {
id: number;
pname: string;
};

type client = {
id: number;
name: string;
};

type Subscription = {
id: number;
clientid: number;
planid: number;
};

export default function AdminPayments() {
const [payments, setPayments] = useState<Payment[]>([]);
const [subs, setSubs] = useState<Subscription[]>([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editPayment, setEditPayment] = useState<Payment | null>(null);
const [formData, setFormData] = useState({
subid: "",
amount: "",
portal: "",
accountno: "",
status: "Paid",
});
const [plans, setPlans] = useState<plan[]>([]);
const [client, setClient] = useState<client[]>([]);

async function fetchAll() {
    try {
        const [payRes, subRes, planRes, clientRes] = await Promise.all([
            getAllPayments(),
            getAllSubscriptions(),
            getAllPlans(),
            getAllClients(),
        ]);

        setPayments(payRes.data);
        setSubs(subRes.data);
        setPlans(planRes.data);
        setClient(clientRes.data);
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
                    Loading payments...
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
        await createPayment({
            subid: Number(formData.subid),
            amount: formData.amount,
            portal: formData.portal,
            accountno: formData.accountno || undefined,
            status: formData.status,
        });

        setShowForm(false);

        setFormData({
            subid: "",
            amount: "",
            portal: "",
            accountno: "",
            status: "Paid",
        });

        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

function openEditForm(payment: Payment) {
    setEditPayment(payment);

    setFormData({
        subid: String(payment.subid),
        amount: payment.amount,
        portal: payment.portal,
        accountno: payment.accountno ?? "",
        status: payment.status,
    });
}

async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!editPayment) return;

    try {
        await updatePayment(editPayment.id, {
            status: formData.status,
        });

        setEditPayment(null);

        setFormData({
            subid: "",
            amount: "",
            portal: "",
            accountno: "",
            status: "Paid",
        });

        fetchAll();
    } catch (error) {
        console.log(error);
    }
}

function clientName(id: number) {
    return client.find((c) => c.id === id)?.name ?? id;
}

function planName(id: number) {
    return plans.find((p) => p.id === id)?.pname ?? id;
}

const columns: ColumnDef<any, Payment>[] = [
    {
        accessorKey: "subid",
        header: "Subscription ID",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "portal",
        header: "Method",
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
                onClick={() => openEditForm(row.original)}
                className="rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-yellow-100 hover:text-black active:scale-95"
            >
                <FaEdit size={17} />
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
                        Payment Management
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Manage Payments
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Record and track subscription payments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
                >
                    <span className="mr-2 text-lg leading-none">+</span>
                    Record Payment
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-yellow-100 bg-yellow-50/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-black">
                                Payment Records
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Track payments made against subscriptions.
                            </p>
                        </div>

                        <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-yellow-400">
                            {payments.length}{" "}
                            {payments.length === 1 ? "Payment" : "Payments"}
                        </span>
                    </div>
                </div>

                <Table<Payment>
                    columns={columns}
                    data={payments}
                    tableKey="admin-payments"
                />
            </div>

            {editPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-2xl">
                        <div className="h-1.5 bg-yellow-400" />

                        <form onSubmit={handleUpdate} className="p-6">
                            <div className="mb-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-black">
                                    <FaEdit size={16} />
                                </div>

                                <h2 className="text-xl font-bold text-black">
                                    Update Payment Status
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Change the current payment status.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="mt-7 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditPayment(null)}
                                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:bg-yellow-300 active:scale-95"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
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
                                    Record Payment
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a new payment record for a subscription.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Subscription
                                    </label>

                                    <select
                                        name="subid"
                                        value={formData.subid}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="">
                                            Select subscription
                                        </option>

                                        {subs.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {clientName(s.clientid)} -{" "}
                                                {planName(s.planid)} (#{s.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Amount
                                    </label>

                                    <input
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Payment amount"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Method
                                    </label>

                                    <select
                                        name="portal"
                                        value={formData.portal}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="">
                                            Select method
                                        </option>
                                        <option value="esewa">eSewa</option>
                                        <option value="khalti">Khalti</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">
                                            Bank Transfer
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Account No
                                        <span className="ml-1 font-normal text-slate-400">
                                            (optional)
                                        </span>
                                    </label>

                                    <input
                                        name="accountno"
                                        value={formData.accountno}
                                        onChange={handleChange}
                                        placeholder="Account number"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-7 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditPayment(null);
                                        setFormData({
                                            subid: "",
                                            amount: "",
                                            portal: "",
                                            accountno: "",
                                            status: "Paid",
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
                                    Record Payment
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