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
import { router } from '@inertiajs/react';
import { PencilLine, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ModuleConfig, ModuleField } from './types';

export default function DataTable({
    config,
    allData,
    onEdit,
}: {
    config: ModuleConfig;
    allData: any;
    onEdit: any;
}) {
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
        const message = `Are you sure you want to delete ${selectedIds.length} ${config?.module_name.toLowerCase()}?`;

        if (confirm(message)) {
            router.delete(`${config?.route_name}/bulk`, {
                data: { ids: selectedIds },
                onSuccess: () => {
                    setSelectedIds([]);
                    alert(`${config.module_name} deleted successfully!`);
                },
            });
        }
    };

    const handleDelete = (id: string | number) => {
        if (
            confirm(
                `Are you sure you want to delete this ${config.model_name.toLowerCase()}?`,
            )
        ) {
            router.delete(`${config?.route_name}/${id}`, {
                onSuccess: () => alert('Deleted successfully!'),
            });
        }
    };

    const formFields = config.fields.filter((f) => !f.table_hide);

    return (
        <div className="space-y-4">
            {/* bulk delete toolbar */}
            {selectedIds.length > 0 && (
                <div className="flex justify-between items-center bg-muted/50 slide-in-from-top-1 p-2 px-4 border rounded-lg animate-in fade-in">
                    <span className="font-medium text-sm">
                        {selectedIds.length} {config.module_name} selected
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

                            {formFields.map((field, index) => (
                                <TableHead
                                    key={field.key}
                                    className={`font-semibold ${index === 0 ? 'text-left' : 'text-center'}`}
                                >
                                    {field.name}
                                </TableHead>
                            ))}

                            <TableHead className="font-semibold text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    className={`transition-colors ${selectedIds.includes(row.id) ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                                >
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
                                    <TableCell>
                                        <div className="flex justify-center gap-1.5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit?.(row)}
                                            >
                                                <PencilLine />
                                                {/* <Link href={`${config.route_name}/${row.id}/edit`}> */}
                                                {/* </Link> */}
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={formFields.length + 2}
                                    className="h-24 text-muted-foreground text-center"
                                >
                                    No {config.module_name.toLowerCase()} found.
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

    if (field.custom_style === 'badge') {
        return (
            <Badge variant="outline" className={field.css_style}>
                {value}
            </Badge>
        );
    }

    return <span className={field.css_style}>{value}</span>;
}
