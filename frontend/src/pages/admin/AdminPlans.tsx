import { useEffect, useState } from "react";
import { createPlan, deletePlan, getAllPlans, getInactivePlans, restorePlan, updatePlan } from "../../api/plan.api";
import type { ColumnDef } from "@tanstack/react-table";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from "../../components/Table";

type Plan = 
{
    id : number;
    pname : string;
    duration : number;
    price : string;
}

export default function AdminPlan()
{
    const [ plans , setPlans ] = useState<Plan[]>([]);
    const [loading , setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ pname: "", duration: "", price: "" });
    const [editPlan , setEditPlan] = useState<Plan | null>(null);
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

    useEffect( () =>
    {
        async function fetchPlans()
        {
            try{
                const response = await getAllPlans();
                setPlans(response.data);
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        fetchPlans()
    },[]);

    if(loading)
    {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-medium text-gray-600">
                    Loading...
                </p>
            </div>
        )
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const{ name , value } = e.target;
        setFormData((prev) => ({...prev , [name] : value}))
    }

    async function handleCreate(e: React.FormEvent)
    {
        e.preventDefault();

        const duration = Number(formData.duration)
        if(isNaN(duration) || duration <= 0)
        {
            alert("Please enter a valid duration");
            return;
        }

        try{
            await createPlan({
                pname : formData.pname,
                duration : Number(formData.duration),
                price : formData.price
            });
            setShowForm(false);
            setFormData({ pname: "", duration: "", price: "" });

            const response = await getAllPlans();
            setPlans(response.data);

        }catch(error)
        {
            console.log(error);
        }
    }

    function openEditForm( plan : Plan)
    {
        setEditPlan(plan);
        setFormData({ pname : plan.pname ,  duration : String(plan.duration) , price : plan.price})
    }

    async function handleUpdate(e: React.FormEvent)
    {
        e.preventDefault()
        if(!editPlan) return;

        const duration = Number(formData.duration)
        if(isNaN(duration) || duration <= 0)
        {
            alert("Please enter a valid duration");
            return;
        }

        try{
            await updatePlan(editPlan.id,{
                pname : formData.pname,
                duration : Number(formData.duration),
                price: formData.price
            });
            setEditPlan(null);
            setFormData({ pname: "", duration: "", price: "" });

            const response = await getAllPlans();
            setPlans(response.data);
        }catch(error)
        {
            console.log(error);
        }
    }

    async function handleDelete(id : number)
    {
            if(!confirm("Do you really wanna delete this plan?"))
            {
                return;
            }

        try{
            await deletePlan(id);
            const [activeRes, inactiveRes] = await Promise.all([getAllPlans(), getInactivePlans()]);
            setPlans(activeRes.data);
            setInactivePlans(inactiveRes.data);
        }catch(error)
        {
            console.log(error);
        }

    }

    async function handleRestore(id: number) {
        try {
            await restorePlan(id);
            const [activeRes, inactiveRes] = await Promise.all([getAllPlans(), getInactivePlans()]);
            setPlans(activeRes.data);
            setInactivePlans(inactiveRes.data);
        } catch (error) {
            console.log(error);
        }
    }

    const inactiveColumns: ColumnDef<any, Plan>[] = [
        { accessorKey: "pname", header: "Plan Name" },
        { accessorKey: "duration", header: "Duration (Days)" },
        { accessorKey: "price", header: "Price" },
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

    const columns : ColumnDef<any , Plan>[] = 
    [
        { accessorKey : "pname" , header : "Plan Name"},
        { accessorKey : "duration" , header : "Duuration(Days)"},
        {accessorKey : "price" , header : "Price" },
        {
            id : "Actions",
            header : "Actions",
            cell : ({row}) => (
                <div className="flex items-center justify-center">
                    <button 
                        onClick = { () => openEditForm(row.original)}
                        className="rounded-lg p-2 text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 active:scale-95"
                    >
                        <FaEdit size={17} />
                    </button>

                    <button
                        onClick = { () => handleDelete(row.original.id)}
                        className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-95"
                    >
                        <FaTrash size = {17} />
                    </button>
                </div>
            )
         }
    ]

return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-6xl">

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Manage Plans
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Create, manage and update your subscription plans.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                >
                    + Add Plan
                </button>
            </div>

            {/* Active Plans */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <Table<Plan>
                    columns={columns}
                    data={plans}
                    tableKey="admin-plans"
                />
            </div>

        {(inactivePlans?.length ?? 0) > 0 && (
                <div className="mt-8">

                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Deleted Plans
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Plans that are currently inactive.
                            </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            {inactivePlans.length}{" "}
                            {inactivePlans.length === 1 ? "Plan" : "Plans"}
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <Table<Plan> 
                            columns={inactiveColumns} 
                            data={inactivePlans} 
                            tableKey="inactive-plans" 
                        />
                    </div>

                </div>
            )}

            {(showForm || editPlan) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <form onSubmit={editPlan ? handleUpdate : handleCreate}>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editPlan ? "Edit Plan" : "Add New Plan"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {editPlan
                                        ? "Update the details of this plan."
                                        : "Enter the details for your new plan."
                                    }
                                </p>
                            </div>

                            <div className="space-y-5">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Plan Name:
                                    </label>

                                    <input
                                        name="pname"
                                        placeholder="Plan Name"
                                        value={formData.pname}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Duration:
                                    </label>

                                    <input
                                        name="duration"
                                        type="number"
                                        placeholder="Time in days"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Price:
                                    </label>

                                    <input
                                        name="price"
                                        placeholder="Money"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                                >
                                    {editPlan ? "Update" : "Submit"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    </div>
)
}
