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
import { ArrowUpDown, Search, Lightbulb } from 'lucide-react';
import { ValuePropositionWithRelations } from '@/lib/api/value-proposition';
import { TableVirtuoso } from 'react-virtuoso';

interface ValuePropositionTableProps {
    valuePropositions: ValuePropositionWithRelations[];
    onValuePropositionClick?: (valueProposition: ValuePropositionWithRelations) => void;
    visibleFields?: string[];
}

export function ValuePropositionTable({ valuePropositions, onValuePropositionClick, visibleFields = [] }: ValuePropositionTableProps) {
    // Helper function to check if a field should be visible
    const isFieldVisible = (fieldName: string) => {
        return visibleFields.length === 0 || visibleFields.includes(fieldName);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'default';
            case 'DRAFT':
                return 'secondary';
            case 'ARCHIVED':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    const allColumns: ColumnDef<ValuePropositionWithRelations>[] = useMemo(
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
                    const valueProposition = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                                <Lightbulb className="h-4 w-4" />
                            </div>
                            <div>
                                <div className="font-medium">{valueProposition.name}</div>
                                {isFieldVisible('status') && (
                                    <Badge 
                                        variant={getStatusBadgeVariant(valueProposition.status)}
                                        className="text-xs mt-1"
                                    >
                                        {valueProposition.status}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="h-8 p-0 hover:bg-transparent"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <Badge variant={getStatusBadgeVariant(row.original.status)} className="font-normal">
                        {row.original.status}
                    </Badge>
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
                id: 'persona',
                accessorKey: 'persona.name',
                header: 'Persona',
                cell: ({ row }) => (
                    <span className="text-gray-700">
                        {row.original.persona?.name || '-'}
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
            {
                id: 'valuePropositionStatements',
                accessorKey: 'valuePropositionStatements',
                header: 'Value Propositions',
                cell: ({ row }) => {
                    const statements = row.original.valuePropositionStatements || [];
                    if (statements.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {statements.slice(0, 2).map((statement, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                    title={`${statement.offering}: ${statement.description}`}
                                >
                                    {statement.offering.length > 20 ? `${statement.offering.substring(0, 20)}...` : statement.offering}
                                </Badge>
                            ))}
                            {statements.length > 2 && (
                                <Badge 
                                    variant="outline" 
                                    className="text-xs"
                                    title={statements.slice(2).map(s => `${s.offering}: ${s.description}`).join('\n')}
                                >
                                    +{statements.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'customerJobs',
                accessorKey: 'customerJobs',
                header: 'Customer Jobs',
                cell: ({ row }) => {
                    const jobs = row.original.customerJobs || [];
                    if (jobs.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {jobs.slice(0, 2).map((job, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                    title={job.description}
                                >
                                    {job.title.length > 15 ? `${job.title.substring(0, 15)}...` : job.title}
                                </Badge>
                            ))}
                            {jobs.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{jobs.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'customerPains',
                accessorKey: 'customerPains',
                header: 'Customer Pains',
                cell: ({ row }) => {
                    const pains = row.original.customerPains || [];
                    if (pains.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {pains.slice(0, 2).map((pain, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-red-50 text-red-700 border-red-200"
                                    title={pain.description}
                                >
                                    {pain.title.length > 15 ? `${pain.title.substring(0, 15)}...` : pain.title}
                                </Badge>
                            ))}
                            {pains.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{pains.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'gainCreators',
                accessorKey: 'gainCreators',
                header: 'Gain Creators',
                cell: ({ row }) => {
                    const gains = row.original.gainCreators || [];
                    if (gains.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {gains.slice(0, 2).map((gain, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                    title={gain.description}
                                >
                                    {gain.title.length > 15 ? `${gain.title.substring(0, 15)}...` : gain.title}
                                </Badge>
                            ))}
                            {gains.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{gains.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'painRelievers',
                accessorKey: 'painRelievers',
                header: 'Pain Relievers',
                cell: ({ row }) => {
                    const relievers = row.original.painRelievers || [];
                    if (relievers.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {relievers.slice(0, 2).map((reliever, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                                    title={reliever.description}
                                >
                                    {reliever.title.length > 15 ? `${reliever.title.substring(0, 15)}...` : reliever.title}
                                </Badge>
                            ))}
                            {relievers.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{relievers.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                id: 'productsServices',
                accessorKey: 'productsServices',
                header: 'Products & Services',
                cell: ({ row }) => {
                    const products = row.original.productsServices || [];
                    if (products.length === 0) return <span className="text-gray-400">-</span>;

                    return (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {products.slice(0, 2).map((product, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                                    title={product.description}
                                >
                                    {product.name.length > 15 ? `${product.name.substring(0, 15)}...` : product.name}
                                </Badge>
                            ))}
                            {products.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{products.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
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
        data: valuePropositions,
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
                <div {...props} ref={ref} className="rounded-md border bg-white" />
            )),
            Table: (props: any) => (
                <Table {...props} className="w-full caption-bottom text-sm" />
            ),
            TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
                <TableHeader {...props} ref={ref} className="bg-gray-50/50 sticky top-0 z-10" />
            )),
            TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
                <TableBody {...props} ref={ref} />
            )),
        }),
        []
    );

    return (
        <div className="space-y-4">
            {/* Virtualized Table with React Virtuoso */}
            <TableVirtuoso
                style={{ height: 600, width: '100%' }}
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
                                onClick={() => onValuePropositionClick?.(row.original)}
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
    );
}
