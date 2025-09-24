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
import { ArrowUpDown, Search, Building2 } from 'lucide-react';
import { BusinessModelWithRelations } from '@/lib/api/business-model';
import { TableVirtuoso } from 'react-virtuoso';
import { isFieldVisible } from '@/lib/utils';
import { useVirtualizedGridHeight } from '@/hooks/use-dynamic-height';

interface BusinessModelTableProps {
    businessModels: BusinessModelWithRelations[];
    onBusinessModelClick?: (businessModel: BusinessModelWithRelations) => void;
    visibleFields?: string[];
}

export function BusinessModelTable({ businessModels, onBusinessModelClick, visibleFields = [] }: BusinessModelTableProps) {

    const allColumns: ColumnDef<BusinessModelWithRelations>[] = useMemo(
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
                    const businessModel = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                                <Building2 className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-medium">
                                    {businessModel.valuePropositionStatement?.offering}
                                </div>
                                {businessModel.valuePropositionStatement?.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {businessModel.valuePropositionStatement?.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                },
            },


            {
                id: 'segment',
                accessorFn: (row) => row.valuePropositionStatement?.valueProposition?.segment?.name || '',
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
                cell: ({ row }) => {
                    const segment = row.original.valuePropositionStatement?.valueProposition?.segment;
                    return segment ? (
                        <Badge variant="outline" className="font-normal">
                            {segment.name}
                        </Badge>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                id: 'persona',
                accessorFn: (row) => row.valuePropositionStatement?.valueProposition?.persona?.name || '',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Persona
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const persona = row.original.valuePropositionStatement?.valueProposition?.persona;
                    return persona ? (
                        <Badge variant="secondary" className="font-normal">
                            {persona.name}
                        </Badge>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                id: 'valuePropositionStatement',
                accessorFn: (row) => row.valuePropositionStatement?.offering || '',
                header: 'Value Proposition',
                cell: ({ row }) => {
                    const statement = row.original.valuePropositionStatement;
                    return statement ? (
                        <div className="max-w-xs">
                            <span className="text-sm text-gray-700 line-clamp-2">
                                {statement.offering}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-400">-</span>
                    );
                },
            },
            {
                id: 'keyPartners',
                accessorFn: (row) => row.keyPartners?.join(', ') || '',
                header: 'Key Partners',
                cell: ({ row }) => {
                    const partners = row.original.keyPartners;
                    if (!partners || partners.length === 0) {
                        return <span className="text-gray-400">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {partners.slice(0, 2).map((partner, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {partner.length > 15 ? `${partner.substring(0, 15)}...` : partner}
                                </Badge>
                            ))}
                            {partners.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{partners.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'keyActivities',
                accessorFn: (row) => row.keyActivities?.join(', ') || '',
                header: 'Key Activities',
                cell: ({ row }) => {
                    const activities = row.original.keyActivities;
                    if (!activities || activities.length === 0) {
                        return <span className="text-gray-400">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {activities.slice(0, 2).map((activity, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    {activity.length > 15 ? `${activity.substring(0, 15)}...` : activity}
                                </Badge>
                            ))}
                            {activities.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{activities.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'customerSegments',
                accessorFn: (row) => row.customerSegments?.join(', ') || '',
                header: 'Customer Segments',
                cell: ({ row }) => {
                    const segments = row.original.customerSegments;
                    if (!segments || segments.length === 0) {
                        return <span className="text-gray-400">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {segments.slice(0, 2).map((segment, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {segment.length > 15 ? `${segment.substring(0, 15)}...` : segment}
                                </Badge>
                            ))}
                            {segments.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{segments.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'revenueStreams',
                accessorFn: (row) => row.revenueStreams?.join(', ') || '',
                header: 'Revenue Streams',
                cell: ({ row }) => {
                    const streams = row.original.revenueStreams;
                    if (!streams || streams.length === 0) {
                        return <span className="text-gray-400">-</span>;
                    }
                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {streams.slice(0, 2).map((stream, index) => (
                                <Badge key={index} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {stream.length > 15 ? `${stream.substring(0, 15)}...` : stream}
                                </Badge>
                            ))}
                            {streams.length > 2 && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                    +{streams.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const date = new Date(row.original.createdAt);
                    return (
                        <div className="text-sm text-gray-500">
                            {date.toLocaleDateString()}
                        </div>
                    );
                },
            },
        ],
        []
    );

    // Filter columns based on visible fields
    const columns = useMemo(() => {
        if (visibleFields.length === 0) {
            return allColumns;
        }
        return allColumns.filter(column => {
            const columnId = typeof column.id === 'string' ? column.id : '';
            return isFieldVisible(visibleFields, columnId);
        });
    }, [allColumns, visibleFields, isFieldVisible]);

    const table = useReactTable({
        data: businessModels,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { rows } = table.getRowModel();

    // Virtuoso components
    const TableComponents = useMemo(
        () => ({
            Scroller: forwardRef<HTMLDivElement>((props, ref) => (
                <div {...props} ref={ref} className="overflow-auto" />
            )),
            Table: (props: any) => (
                <Table {...props} className="w-full h-[1200px] caption-bottom text-sm" />
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

    if (businessModels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Building2 className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No business models found</p>
                <p className="text-sm">Create your first business model to get started</p>
            </div>
        );
    }

    const { height, containerRef } = useVirtualizedGridHeight();


    return (
        <div className="w-full h-full">
            <div className="border rounded-md bg-white overflow-hidden" ref={containerRef} style={{ height: height }}>
                <TableVirtuoso
                    style={{ height: '100%', width: '100%' }}
                    data={rows}
                    components={TableComponents}
                    increaseViewportBy={500}
                    fixedHeaderContent={() => (
                        <TableRow className="bg-gray-50 border-b">
                            {table.getHeaderGroups()[0]?.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="font-semibold py-3 px-4 text-left bg-gray-50 sticky top-0 z-10"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    )}
                    itemContent={(index, row) => (
                        <>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    className="py-3 px-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => onBusinessModelClick?.(row.original)}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </>
                    )}
                />
            </div>
        </div>
    );
}
