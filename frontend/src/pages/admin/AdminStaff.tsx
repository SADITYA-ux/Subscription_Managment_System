import { useEffect, useState } from "react";
import { getAllStaff, createStaff, updateStaff, deactivateStaff } from "../../api/staff.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../components/Table";

type Staff = {
id: number;
name: string;
address: string;
phone: string;
age: number;
};

export default function AdminStaff() {
const [staff, setStaff] = useState<Staff[]>([]);
const [loading, setLoading] = useState(true);
const [showForm, setShowForm] = useState(false);
const [editStaff, setEditStaff] = useState<Staff | null>(null);
const [formData, setFormData] = useState({
email: "",
password: "",
name: "",
address: "",
phone: "",
age: "",
});

async function fetchStaff() {
    try {
        const response = await getAllStaff();
        setStaff(response.data);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    fetchStaff();
}, []);

if (loading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f8f6]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-400" />
                <p className="text-sm font-medium text-slate-500">
                    Loading staff...
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

    const age = Number(formData.age);

    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid age");
        return;
    }

    try {
        await createStaff({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            age,
        });

        setShowForm(false);
        setFormData({
            email: "",
            password: "",
            name: "",
            address: "",
            phone: "",
            age: "",
        });

        fetchStaff();
    } catch (error) {
        console.log(error);
    }
}

function openEditForm(s: Staff) {
    setEditStaff(s);

    setFormData({
        email: "",
        password: "",
        name: s.name,
        address: s.address,
        phone: s.phone,
        age: String(s.age),
    });
}

async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!editStaff) return;

    const age = Number(formData.age);

    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid age");
        return;
    }

    try {
        await updateStaff(editStaff.id, {
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            age,
        });

        setEditStaff(null);

        setFormData({
            email: "",
            password: "",
            name: "",
            address: "",
            phone: "",
            age: "",
        });

        fetchStaff();
    } catch (error) {
        console.log(error);
    }
}

async function handleDeactivate(id: number) {
    if (!confirm("Deactivate this staff member?")) return;

    try {
        await deactivateStaff(id);
        fetchStaff();
    } catch (error) {
        console.log(error);
    }
}

const columns: ColumnDef<any, Staff>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "age",
        header: "Age",
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
                    onClick={() => handleDeactivate(row.original.id)}
                    className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                >
                    <FaTrash size={17} />
                </button>
            </div>
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
                        Staff Management
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                        Manage Staff
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Add and manage staff accounts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-black shadow-sm shadow-yellow-200 transition hover:-translate-y-0.5 hover:bg-yellow-300 active:scale-95"
                >
                    <span className="mr-2 text-lg leading-none">+</span>
                    Add Staff
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-yellow-100 bg-yellow-50/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-black">
                                Staff Members
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Manage your active staff accounts.
                            </p>
                        </div>

                        <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-yellow-400">
                            {staff.length} {staff.length === 1 ? "Member" : "Members"}
                        </span>
                    </div>
                </div>

                <Table<Staff>
                    columns={columns}
                    data={staff}
                    tableKey="admin-staff"
                />
            </div>

            {(showForm || editStaff) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-2xl">
                        <div className="h-1.5 bg-yellow-400" />

                        <form
                            onSubmit={editStaff ? handleUpdate : handleCreate}
                            className="p-6"
                        >
                            <div className="mb-6">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-black">
                                    {editStaff ? (
                                        <FaEdit size={16} />
                                    ) : (
                                        <span className="text-xl font-bold">+</span>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-black">
                                    {editStaff ? "Edit Staff" : "Add Staff"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {editStaff
                                        ? "Update this staff member's information."
                                        : "Create a new staff account."
                                    }
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Name
                                    </label>

                                    <input
                                        name="name"
                                        placeholder="Staff name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                {!editStaff && (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Email
                                            </label>

                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="staff@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Password
                                            </label>

                                            <input
                                                name="password"
                                                type="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Address
                                    </label>

                                    <input
                                        name="address"
                                        placeholder="Staff address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        placeholder="Phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Age
                                    </label>

                                    <input
                                        name="age"
                                        type="number"
                                        placeholder="Age"
                                        value={formData.age}
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
                                        setEditStaff(null);
                                        setFormData({
                                            email: "",
                                            password: "",
                                            name: "",
                                            address: "",
                                            phone: "",
                                            age: "",
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
                                    {editStaff ? "Update Staff" : "Create Staff"}
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