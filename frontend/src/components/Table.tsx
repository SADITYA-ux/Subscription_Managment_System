import {
tableFeatures,
useTable,
type ColumnDef,
type RowData,
} from "@tanstack/react-table";

const features = tableFeatures({});

type TableProps<TData extends RowData> = {
columns: Array<ColumnDef<typeof features, TData>>;
data: Array<TData>;
tableKey: string;
};

export default function Table<TData extends RowData>({
columns,
data,
tableKey,
}: TableProps<TData>) {
const table = useTable({
key: tableKey,
features,
columns,
data,
});

return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            key={headerGroup.id}
                            className="border-b border-yellow-100 bg-yellow-50/60"
                        >
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-black"
                                >
                                    {header.isPlaceholder ? null : (
                                        <table.FlexRender header={header} />
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="group bg-white transition-colors duration-150 hover:bg-yellow-50/40"
                            >
                                {row.getAllCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="whitespace-nowrap px-5 py-4 text-sm text-slate-700"
                                    >
                                        <table.FlexRender cell={cell} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-14 text-center"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-black">
                                        <span className="text-lg font-bold">
                                            —
                                        </span>
                                    </div>

                                    <p className="text-sm font-semibold text-black">
                                        No data found
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        There is nothing to display here yet.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
}