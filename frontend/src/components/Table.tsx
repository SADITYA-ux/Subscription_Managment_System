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
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-yellow-400/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-500/10 blur-[80px]" />

            <div className="relative overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                key={headerGroup.id}
                                className="border-b border-white/10 bg-white/[0.02]"
                            >
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-yellow-300"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group bg-transparent transition-colors duration-200 hover:bg-yellow-400/[0.06]"
                                >
                                    {row.getAllCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="whitespace-nowrap px-5 py-4 text-sm text-white/70 transition-colors duration-200 group-hover:text-white"
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
                                        <div className="mb-4 flex h-14 w-14 animate-pop items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30">
                                            <span className="text-lg font-black">
                                                —
                                            </span>
                                        </div>

                                        <p className="text-sm font-semibold text-white">
                                            No data found
                                        </p>

                                        <p className="mt-1 text-xs text-white/40">
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