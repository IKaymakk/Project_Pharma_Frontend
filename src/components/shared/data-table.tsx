import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    return (
        <div className="w-full bg-white border-t text-sm">
            <div className="overflow-auto">
                <Table className="w-full border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                                {/* 1. SATIR: SÜTUN BAŞLIKLARI + Huni İkonu */}
                                <TableRow className="border-b border-slate-300 hover:bg-transparent">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-8 px-2 text-slate-600 font-semibold border-r border-slate-300 bg-white text-xs whitespace-nowrap relative"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>

                                {/* 2. SATIR: ARAMA KUTUCUKLARI + Büyüteç İkonu */}
                                <TableRow className="border-b border-slate-300 hover:bg-transparent bg-white">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={`${header.id}-search`} className="h-9 p-1 border-r border-slate-300 bg-white">
                                            {header.id !== "actions" && header.id !== "imageUrl" ? (
                                                <div className="relative flex items-center">
                                                    <Search className="absolute left-1.5 h-3 w-3 text-slate-400" />
                                                    <Input
                                                        className="h-7 w-full pl-6 pr-1 text-xs  rounded-sm shadow-none border-none"
                                                        value={(header.column.getFilterValue() as string) ?? ""}
                                                        onChange={(event) => header.column.setFilterValue(event.target.value)}
                                                    />
                                                </div>
                                            ) : null}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b border-slate-300 hover:bg-slate-50 transition-none h-8"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-2 border-r border-slate-300 text-slate-700 align-middle text-xs">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500 border-r border-slate-300">
                                    Kayıt bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between px-2 py-1 border-r border-b border-slate-300 bg-white">
                <div className="text-[10px] text-slate-500 font-medium">
                    Toplam {table.getFilteredRowModel().rows.length} kayıt listelendi.
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-sm hover:bg-slate-100"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                    </Button>
                    <span className="text-[10px] text-slate-600">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-sm hover:bg-slate-100"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                    </Button>
                </div>
            </div>
        </div>
    )
}