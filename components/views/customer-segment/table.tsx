'use client';

import React, { useMemo, forwardRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
    Row,
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
import { ArrowUpDown, Search } from 'lucide-react';
import { Persona } from '@/lib/api/customer-segment';
import { TableVirtuoso } from 'react-virtuoso';


interface PersonaTableProps {
    personas: Persona[];
    onPersonaClick?: (persona: Persona) => void;
    visibleFields?: string[];
}

export function PersonaTable({ personas, onPersonaClick, visibleFields = [] }: PersonaTableProps) {
    // Helper function to check if a field should be visible
    const isFieldVisible = (fieldName: string) => {
        return visibleFields.length === 0 || visibleFields.includes(fieldName);
    };
    const allColumns: ColumnDef<Persona>[] = useMemo(
        () => [
            {
                id: 'name',
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
                                {isFieldVisible('age') && persona.age && (
                                    <div className="text-sm text-gray-500">{persona.age} years old</div>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'age',
                accessorKey: 'age',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Age
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.age || '-'}
                    </span>
                ),
            },
            {
                id: 'segment',
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
                id: 'gender',
                accessorKey: 'gender',
                header: 'Gender',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.gender || '-'}
                    </span>
                ),
            },
            {
                id: 'location',
                accessorKey: 'location',
                header: 'Location',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.location || '-'}
                    </span>
                ),
            },
            {
                id: 'education',
                accessorKey: 'education',
                header: 'Education',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.education || '-'}
                    </span>
                ),
            },
            {
                id: 'incomePerMonth',
                accessorKey: 'incomePerMonth',
                header: 'Income',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.incomePerMonth || '-'}
                    </span>
                ),
            },
            {
                id: 'painPoints',
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
                id: 'channels',
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
            {
                id: 'quote',
                accessorKey: 'quote',
                header: 'Quote',
                cell: ({ row }) => (
                    <span className="text-gray-700 italic max-w-xs truncate">
                        {row.original.quote ? `"${row.original.quote}"` : '-'}
                    </span>
                ),
            },
            {
                id: 'description',
                accessorKey: 'description',
                header: 'Description',
                cell: ({ row }) => (
                    <span className="text-gray-700 max-w-xs truncate">
                        {row.original.description || '-'}
                    </span>
                ),
            },
        ],
        [isFieldVisible]
    );

    // Filter columns based on visible fields
    const columns = useMemo(() => {
        if (visibleFields.length === 0) return allColumns;
        return allColumns.filter(column =>
            column.id && isFieldVisible(column.id)
        );
    }, [allColumns, visibleFields, isFieldVisible]);

    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data: personas,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
    });

    const { rows } = table.getRowModel();

    // Virtuoso components
    const TableComponents = useMemo(
        () => ({
            Scroller: forwardRef<HTMLDivElement>((props, ref) => (
                <div {...props} ref={ref} className="overflow-auto" />
            )),
            Table: (props: any) => (
                <Table {...props} className="w-full caption-bottom text-sm" />
            ),
            TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
                <TableHeader {...props} ref={ref} className="bg-gray-50 sticky top-0 z-20 border-b" />
            )),
            TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
                <TableBody {...props} ref={ref} />
            )),
        }),
        []
    );



    return (
        <div className="w-full h-full">
            <div className="border rounded-md bg-white overflow-hidden" style={{ height: 800 }}>
                <TableVirtuoso
                    style={{ height: 700, width: '100%' }}
                    data={rows}
                    components={TableComponents}
                    fixedHeaderContent={() => (
                        <>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="font-semibold py-3 px-4 border-b">
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
                        </>
                    )}
                    itemContent={(index, row) => (
                        <>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => onPersonaClick?.(row.original)}
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </>
                    )}
                />


            </div>
        </div>
    );
}