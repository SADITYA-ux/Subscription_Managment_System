import { useEffect, useState } from "react";
import { getAllPayments, createPayment, updatePayment } from "../../api/payment.api";
import { getAllSubscriptions } from "../../api/subscription.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit } from "react-icons/fa";
import Table from "../../components/Table";

type Payment = {
    id: number;
    subid: number;
    amount: string;
    portal: string;
    accountno: string | null;
    status: string;
};

type Subscription = { id: number };

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editPayment, setEditPayment] = useState<Payment | null>(null);
    const [formData, setFormData] = useState({ subid: "", amount: "", portal: "", accountno: "", status: "Paid" });

    async function fetchAll() {
        try {
            const [payRes, subRes] = await Promise.all([getAllPayments(), getAllSubscriptions()]);
            setPayments(payRes.data);
            setSubs(subRes.data);
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
            await createPayment({
                subid: Number(formData.subid),
                amount: formData.amount,
                portal: formData.portal,
                accountno: formData.accountno || undefined,
                status: formData.status,
            });
            setShowForm(false);
            setFormData({ subid: "", amount: "", portal: "", accountno: "", status: "Paid" });
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
                amount: formData.amount,
                portal: formData.portal,
                accountno: formData.accountno || undefined,
                status: formData.status,
            });
            setEditPayment(null);
            setFormData({ subid: "", amount: "", portal: "", accountno: "", status: "Paid" });
            fetchAll();
        } catch (error) {
            console.log(error);
        }
    }

    const columns: ColumnDef<any, Payment>[] = [
        { accessorKey: "subid", header: "Subscription ID" },
        { accessorKey: "amount", header: "Amount" },
        { accessorKey: "portal", header: "Method" },
        { accessorKey: "status", header: "Status" },
        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <button
                    onClick={() => openEditForm(row.original)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                >
                    <FaEdit size={17} />
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
                            Manage Payments
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">Record and track subscription payments.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Record Payment
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <Table<Payment> columns={columns} data={payments} tableKey="admin-payments" />
                </div>

                {(showForm || editPayment) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <form onSubmit={editPayment ? handleUpdate : handleCreate}>
                                <h2 className="mb-6 text-xl font-bold text-gray-900">
                                    {editPayment ? "Edit Payment" : "Record Payment"}
                                </h2>

                                <div className="space-y-5">
                                    {!editPayment && (
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Subscription:
                                            </label>
                                            <select
                                                name="subid"
                                                value={formData.subid}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            >
                                                <option value="">Select subscription</option>
                                                {subs.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        #{s.id}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Amount:
                                        </label>
                                        <input
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Method:
                                        </label>
                                        <select
                                            name="portal"
                                            value={formData.portal}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        >
                                            <option value="">Select method</option>
                                            <option value="esewa">eSewa</option>
                                            <option value="khalti">Khalti</option>
                                            <option value="cash">Cash</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Account No (optional):
                                        </label>
                                        <input
                                            name="accountno"
                                            value={formData.accountno}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Status:
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
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
                                            setFormData({ subid: "", amount: "", portal: "", accountno: "", status: "Paid" });
                                        }}
                                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        {editPayment ? "Update" : "Record"}
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