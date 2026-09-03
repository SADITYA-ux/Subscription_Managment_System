import { useEffect, useState } from "react";
import { getAllClients, updateClient, deleteClient, getInactiveClient, restoreClient } from "../../api/client.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../components/Table";

type Client = {
    id: number;
    name: string;
    address: string;
    number: string;
    age: number;
};

export default function AdminClient() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [editClient, setEditClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState({ name: "", address: "", number: "", age: "" });
    const [inactiveClient , setInactiveClient] = useState<Client[]>([]);

    useEffect(() => {
        async function fetchClients() {
            try {
                const [response , inactiveResponse] = await Promise.all([
                    getAllClients(),
                    getInactiveClient()
                ])
                setClients(response.data);
                setInactiveClient(inactiveResponse.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        );
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function openEditForm(client: Client) {
        setEditClient(client);
        setFormData({
            name: client.name,
            address: client.address,
            number: client.number,
            age: String(client.age),
        });
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editClient) return;

        const age = Number(formData.age);
        if (isNaN(age) || age <= 0) {
            alert("Please enter a valid age");
            return;
        }

        try {
            await updateClient(editClient.id, {
                name: formData.name,
                address: formData.address,
                number: formData.number,
                age,
            });
            setEditClient(null);
            setFormData({ name: "", address: "", number: "", age: "" });

            const response = await getAllClients();
            setClients(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRestore(id:number) 
    {
        try
        {
            await restoreClient(id);
            const [activeRes , inactiveRes] = await Promise.all([getAllClients() , getInactiveClient()]);
            setClients(activeRes.data);
            setInactiveClient(inactiveRes.data);
        }catch(error)
        {
            console.log(error)
        }   
    }

    async function handleDeactivate(id: number) {
        if (!confirm("Do you really want to deactivate this client?")) {
            return;
        }

        try {
            await deleteClient(id);
            const response = await getAllClients();
            setClients(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const columns: ColumnDef<any, Client>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "number", header: "Phone" },
        { accessorKey: "age", header: "Age" },
        {
            id: "Actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => openEditForm(row.original)}
                        className="rounded-lg p-2 text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                    >
                        <FaEdit size={17} />
                    </button>
                    <button
                        onClick={() => handleDeactivate(row.original.id)}
                        className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-95"
                    >
                        <FaTrash size={17} />
                    </button>
                </div>
            ),
        },
    ];

    const inactiveColumns: ColumnDef<any , Client>[] = 
    [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "number", header: "Phone" },
        { accessorKey: "age", header: "Age" },
        {
            id : "Actions",
            header : "Actions",
            cell : ({row}) => (
                <button
                    onClick={() => handleRestore(row.original.id)}
                    className="rounded-lg bg-green-100 px-3 py-1 text-xs text-green-800 hover:bg-green-200"
                >
                    Restore
                </button>
            )
        }   
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Manage Clients
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage registered clients.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <Table<Client> 
                        columns={columns} 
                        data={clients} 
                        tableKey="admin-clients"
                     />
                </div>

                {(inactiveClient?.length ?? 0) > 0 &&(
                    <div className="mt-8">
    
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Deleted Clients
                                </h2>
    
                                <p className="mt-1 text-sm text-gray-500">
                                    Clients that are currently inactive.
                                </p>
                            </div>
    
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                {inactiveClient.length}{" "}
                                {inactiveClient.length === 1 ? "Client" : "Clients"}
                            </span>
                        </div>
    
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <Table<Client> 
                                columns={inactiveColumns} 
                                data={inactiveClient} 
                                tableKey="inactive-plans" 
                            />
                        </div>
    
                    </div>
                )

                }

                {editClient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Edit Client</h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Update this client's details.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Name:
                                        </label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Address:
                                        </label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Phone:
                                        </label>
                                        <input
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Age:
                                        </label>
                                        <input
                                            name="age"
                                            type="number"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-7 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditClient(null);
                                            setFormData({ name: "", address: "", number: "", age: "" });
                                        }}
                                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                                    >
                                        Update
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