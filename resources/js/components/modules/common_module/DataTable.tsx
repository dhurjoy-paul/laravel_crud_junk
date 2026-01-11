import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { router } from '@inertiajs/react';
import { ArrowUpDown, Check, PencilLine, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ModuleConfig, ModuleField } from './types';

export default function DataTable({
    module,
    allData,
    onEdit,
    filters,
}: {
    module: ModuleConfig;
    allData: any;
    onEdit: any;
    filters: any;
}) {
    const showActions = module.actions ?? true;
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const rows = allData?.data || [];

    const toggleSelectAll = () => {
        const currentPageIds = rows.map((r: any) => r.id);
        const allSelected = currentPageIds.every((id: any) =>
            selectedIds.includes(id),
        );
        setSelectedIds((prev) =>
            allSelected
                ? prev.filter((id) => !currentPageIds.includes(id))
                : [...new Set([...prev, ...currentPageIds])],
        );
    };

    const toggleSelectRow = (id: string | number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const handleBulkDelete = () => {
        const message = `Are you sure you want to delete ${selectedIds.length} ${module?.module_name.toLowerCase()}?`;

        if (confirm(message)) {
            router.delete(`${module?.route_name}/bulk`, {
                data: { ids: selectedIds },
                onSuccess: () => {
                    setSelectedIds([]);
                    alert(`${module.module_name} deleted successfully!`);
                },
            });
        }
    };

    const handleDelete = (id: string | number) => {
        if (
            confirm(
                `Are you sure you want to delete this ${module.model_name.toLowerCase()}?`,
            )
        ) {
            router.delete(`${module?.route_name}/${id}`, {
                onSuccess: () => alert('Deleted successfully!'),
            });
        }
    };

    const handleSort = (columnKey: string) => {
        const currentField = module.fields.find((f) => f.key === columnKey);
        if (!currentField?.sort) return;

        const params = new URLSearchParams(window.location.search);
        const currentCol = params.get('column');
        const currentSort = params.get('sort');

        const newDirection =
            currentCol === columnKey && currentSort === 'asc' ? 'desc' : 'asc';

        router.get(
            module.route_name,
            {
                ...filters,
                column: columnKey,
                sort: newDirection,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const formFields = module.fields.filter((f) => !f.table_hide);

    return (
        <div className="space-y-4">
            {/* bulk delete toolbar */}
            {showActions === true && selectedIds.length > 0 && (
                <div className="flex justify-between items-center bg-muted/50 slide-in-from-top-1 p-2 px-4 border rounded-lg animate-in fade-in">
                    <span className="font-medium text-sm">
                        {selectedIds.length} {module.module_name} selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBulkDelete()}
                        >
                            Delete Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIds([])}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* main table */}
            <div className="border rounded-md w-full overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {showActions === true && (
                                <TableHead className="w-[50px] text-center">
                                    <Checkbox
                                        checked={
                                            rows.length > 0 &&
                                            rows.every((r: any) =>
                                                selectedIds.includes(r.id),
                                            )
                                        }
                                        onCheckedChange={toggleSelectAll}
                                        className="border-2 border-foreground cursor-pointer"
                                    />
                                </TableHead>
                            )}

                            {formFields.map((field, index) => (
                                <TableHead
                                    key={field.key}
                                    className={`font-semibold ${index === 0 ? 'text-left' : 'text-center'}`}
                                >
                                    {field.sort ? (
                                        <Button
                                            onClick={() =>
                                                handleSort(field.key)
                                            }
                                            variant="ghost"
                                            className="flex justify-center items-center gap-2 mx-auto w-fit cursor-pointer"
                                        >
                                            <span>{field.name}</span>
                                            <ArrowUpDown
                                                size={14}
                                                className="font-bold text-muted-foreground"
                                            />
                                        </Button>
                                    ) : (
                                        field.name
                                    )}
                                </TableHead>
                            ))}

                            {showActions === true && (
                                <TableHead className="font-semibold text-center">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    className={`transition-colors ${selectedIds.includes(row.id) ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                                >
                                    {showActions === true && (
                                        <TableCell className="text-center">
                                            <Checkbox
                                                className="border-[1.5px] border-foreground cursor-pointer"
                                                checked={selectedIds.includes(
                                                    row.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelectRow(row.id)
                                                }
                                            />
                                        </TableCell>
                                    )}

                                    {formFields.map((field, index) => (
                                        <TableCell
                                            key={field.key}
                                            className={
                                                index === 0
                                                    ? 'text-left'
                                                    : 'text-center'
                                            }
                                        >
                                            {renderCell(field, row)}
                                        </TableCell>
                                    ))}

                                    {/* actions */}
                                    {showActions === true && (
                                        <TableCell>
                                            <div className="flex justify-center gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        onEdit?.(row)
                                                    }
                                                >
                                                    <PencilLine />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-destructive/50 text-destructive-foreground hover:text-destructive-foreground"
                                                    onClick={() =>
                                                        handleDelete(row.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={formFields.length + 2}
                                    className="h-24 text-muted-foreground text-center"
                                >
                                    No {module.module_name.toLowerCase()} found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function renderCell(field: ModuleField, row: any) {
    const value = row[field.key];

    if (field.input_type === 'checkbox' || typeof value === 'boolean') {
        return (
            <div className="flex justify-center">
                {Number(value) === 1 ? (
                    <Badge className="gap-1 bg-green-50 dark:bg-green-700 border-green-400 rounded-full text-green-900 dark:text-green-50">
                        <Check size={12} strokeWidth={5} />
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="gap-1 bg-red-50 dark:bg-red-700 border-red-400 rounded-full text-red-900 dark:text-red-50"
                    >
                        <X size={12} strokeWidth={5} />
                    </Badge>
                )}
            </div>
        );
    }

    if (field.key === 'image_url' || field.key === 'image') {
        return value ? (
            <img
                src={`/storage/${value}`}
                className="mx-auto rounded size-10 object-cover"
                alt="thumbnail"
            />
        ) : (
            <span className="text-muted-foreground text-xs">No Image</span>
        );
    }

    if (field.custom_style === 'truncate') {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                        <span
                            className={`mx-auto block max-w-[250px] cursor-help truncate ${field.css_style}`}
                        >
                            {value}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs break-words">
                        <p>{value}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (field.custom_style === 'badge') {
        return (
            <Badge variant="outline" className={field.css_style}>
                {value}
            </Badge>
        );
    }

    return <span className={field.css_style}>{value ?? '-'}</span>;
}
