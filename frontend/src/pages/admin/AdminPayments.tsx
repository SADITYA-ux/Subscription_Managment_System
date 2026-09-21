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
                    className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-yellow-400/15 hover:text-yellow-300 active:scale-95"
                >
                    <FaEdit size={17} />
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
                            Payment Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Manage <span className="text-gradient">Payments</span>
                        </h1>

                        <p className="mt-2 text-sm text-white/50">
                            Record and track subscription payments.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="group/btn relative inline-flex animate-fade-up items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 [animation-delay:120ms] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg leading-none">+</span>
                            Record Payment
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    </button>
                </div>

                <div className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md [animation-delay:200ms]">
                    <div className="border-b border-white/10 bg-gradient-to-r from-yellow-400/10 to-transparent px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white">
                                    Payment Records
                                </h2>

                                <p className="mt-1 text-xs text-white/50">
                                    Track payments made against subscriptions.
                                </p>
                            </div>

                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
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
                    <div className="fixed inset-0 z-50 flex animate-fade-up items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#15151c] shadow-2xl shadow-black/60">
                            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                            <form onSubmit={handleUpdate} className="p-6">
                                <div className="mb-6">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                                        <FaEdit size={16} />
                                    </div>

                                    <h2 className="text-xl font-bold text-white">
                                        Update Payment Status
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        Change the current payment status.
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white/80">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    >
                                        <option className="bg-[#15151c]" value="Paid">Paid</option>
                                        <option className="bg-[#15151c]" value="Pending">Pending</option>
                                        <option className="bg-[#15151c]" value="Overdue">Overdue</option>
                                    </select>
                                </div>

                                <div className="mt-7 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditPayment(null)}
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                                    >
                                        <span className="relative z-10">Update</span>
                                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                                    </button>
                                </div>
                            </form>
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
                                        Record Payment
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        Add a new payment record for a subscription.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Subscription
                                        </label>

                                        <select
                                            name="subid"
                                            value={formData.subid}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        >
                                            <option className="bg-[#15151c]" value="">
                                                Select subscription
                                            </option>

                                            {subs.map((s) => (
                                                <option className="bg-[#15151c]" key={s.id} value={s.id}>
                                                    {clientName(s.clientid)} -{" "}
                                                    {planName(s.planid)} (#{s.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Amount
                                        </label>

                                        <input
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="Payment amount"
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Method
                                        </label>

                                        <select
                                            name="portal"
                                            value={formData.portal}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        >
                                            <option className="bg-[#15151c]" value="">
                                                Select method
                                            </option>
                                            <option className="bg-[#15151c]" value="esewa">eSewa</option>
                                            <option className="bg-[#15151c]" value="khalti">Khalti</option>
                                            <option className="bg-[#15151c]" value="cash">Cash</option>
                                            <option className="bg-[#15151c]" value="bank_transfer">
                                                Bank Transfer
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Account No
                                            <span className="ml-1 font-normal text-white/40">
                                                (optional)
                                            </span>
                                        </label>

                                        <input
                                            name="accountno"
                                            value={formData.accountno}
                                            onChange={handleChange}
                                            placeholder="Account number"
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        >
                                            <option className="bg-[#15151c]" value="Paid">Paid</option>
                                            <option className="bg-[#15151c]" value="Pending">Pending</option>
                                            <option className="bg-[#15151c]" value="Overdue">Overdue</option>
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
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                                    >
                                        <span className="relative z-10">Record Payment</span>
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