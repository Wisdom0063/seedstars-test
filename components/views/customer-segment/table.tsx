'use client';

import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    Search
} from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';

interface PersonaTableProps {
    personas: Persona[];
    onPersonaClick?: (persona: Persona) => void;
}

export function PersonaTable({ personas, onPersonaClick }: PersonaTableProps) {
    const columns: ColumnDef<Persona>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const persona = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {persona.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium">{persona.name}</div>
                                {persona.age && (
                                    <div className="text-sm text-gray-500">{persona.age} years old</div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'segment.name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Segment
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <Badge variant="outline" className="font-normal">
                        {row.original.segment.name}
                    </Badge>
                ),
            },
            {
                accessorKey: 'location',
                header: 'Location',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.location || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'education',
                header: 'Education',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.education || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'incomePerMonth',
                header: 'Income',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.incomePerMonth || '-'}
                    </span>
                ),
            },
            {
                accessorKey: 'painPoints',
                header: 'Pain Points',
                cell: ({ row }) => {
                    const painPoints = row.original.painPoints || [];
                    if (painPoints.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {painPoints.slice(0, 2).map((point, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                >
                                    {point.length > 20 ? `${point.substring(0, 20)}...` : point}
                                </Badge>
                            ))}
                            {painPoints.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{painPoints.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'channels',
                header: 'Channels',
                cell: ({ row }) => {
                    const channels = row.original.channels || [];
                    if (channels.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {channels.slice(0, 2).map((channel, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                    {channel}
                                </Badge>
                            ))}
                            {channels.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{channels.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
        ],
        []
    );

    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data: personas,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search personas..."
                        value={globalFilter ?? ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    {table.getFilteredRowModel().rows.length} of {personas.length} personas
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="font-semibold">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="cursor-pointer"
                                    onClick={() => onPersonaClick?.(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-gray-500"
                                >
                                    No personas found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Page {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}