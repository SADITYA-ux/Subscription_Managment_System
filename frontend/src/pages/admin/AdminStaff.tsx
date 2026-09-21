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
                        className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-yellow-400/15 hover:text-yellow-300 active:scale-95"
                    >
                        <FaEdit size={17} />
                    </button>

                    <button
                        onClick={() => handleDeactivate(row.original.id)}
                        className="rounded-lg p-2 text-white/50 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:scale-95"
                    >
                        <FaTrash size={17} />
                    </button>
                </div>
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
                            Staff Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Manage <span className="text-gradient">Staff</span>
                        </h1>

                        <p className="mt-2 text-sm text-white/50">
                            Add and manage staff accounts.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="group/btn relative inline-flex animate-fade-up items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 [animation-delay:120ms] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span className="text-lg leading-none">+</span>
                            Add Staff
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    </button>
                </div>

                <div className="animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md [animation-delay:200ms]">
                    <div className="border-b border-white/10 bg-gradient-to-r from-yellow-400/10 to-transparent px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-white">
                                    Staff Members
                                </h2>

                                <p className="mt-1 text-xs text-white/50">
                                    Manage your active staff accounts.
                                </p>
                            </div>

                            <span className="rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/30">
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
                    <div className="fixed inset-0 z-50 flex animate-fade-up items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#15151c] shadow-2xl shadow-black/60">
                            <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                            <form
                                onSubmit={editStaff ? handleUpdate : handleCreate}
                                className="p-6"
                            >
                                <div className="mb-6">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                                        {editStaff ? (
                                            <FaEdit size={16} />
                                        ) : (
                                            <span className="text-xl font-bold">+</span>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-white">
                                        {editStaff ? "Edit Staff" : "Add Staff"}
                                    </h2>

                                    <p className="mt-1 text-sm text-white/50">
                                        {editStaff
                                            ? "Update this staff member's information."
                                            : "Create a new staff account."
                                        }
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Name
                                        </label>

                                        <input
                                            name="name"
                                            placeholder="Staff name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    {!editStaff && (
                                        <>
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-white/80">
                                                    Email
                                                </label>

                                                <input
                                                    name="email"
                                                    type="email"
                                                    placeholder="staff@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-white/80">
                                                    Password
                                                </label>

                                                <input
                                                    name="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Address
                                        </label>

                                        <input
                                            name="address"
                                            placeholder="Staff address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Phone
                                        </label>

                                        <input
                                            name="phone"
                                            placeholder="Phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-white/80">
                                            Age
                                        </label>

                                        <input
                                            name="age"
                                            type="number"
                                            placeholder="Age"
                                            value={formData.age}
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
                                        className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-95"
                                    >
                                        <span className="relative z-10">
                                            {editStaff ? "Update Staff" : "Create Staff"}
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