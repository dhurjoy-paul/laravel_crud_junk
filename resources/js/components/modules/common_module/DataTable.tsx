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
import { router, usePage } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    FilterX,
    PencilLine,
    RefreshCcw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ActiveFilters } from './ActiveFilters';
import { ColumnSettingsDropdown } from './columnSettingsDropdown';
import { DataTableCell } from './DataTableCell';
import { useTableSettings } from './hooks/useColumnSettings';
import { useFilters } from './hooks/useFilters';
import { ReusableFilter } from './ReusableFilter';
import { ModuleConfig } from './types';

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
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
    const { fields } = module || {};
    const rows = allData?.data || [];
    const showActions = module.actions ?? true;

    const { columnSettings, visibleFields, toggleColumn, moveColumn } =
        useTableSettings(module);
    const { hasActiveFilters, clearFilters } = useFilters(fields, filters);

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

    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split('?')[1] || '');
    const currentSortColumn = queryParams.get('column');
    const currentSortDirection = queryParams.get('sort');

    return (
        <div className="space-y-4">
            {/* active filters + table customize tools */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-b px-1 py-2">
                <div className="min-w-0 flex-1">
                    <ActiveFilters fields={fields} filters={filters} />
                </div>

                <div className="flex shrink-0 items-center gap-2 border-l pl-4">
                    {hasActiveFilters && (
                        <Button
                            onClick={() => clearFilters()}
                            variant="destructive"
                            size="sm"
                            className="ml-auto w-fit cursor-pointer"
                        >
                            <FilterX size={12} />
                            Clear all filters
                        </Button>
                    )}

                    {/* reset table button */}
                    <Button
                        onClick={() => clearFilters(true)}
                        variant="secondary"
                        size="sm"
                        className={`w-fit cursor-pointer ${hasActiveFilters ? '' : 'ml-auto'}`}
                    >
                        <RefreshCcw
                            size={24}
                            color="currentColor"
                            strokeWidth={2}
                        />
                        Reset Table
                    </Button>

                    {/* customize columns */}
                    <div>
                        <ColumnSettingsDropdown
                            columnSettings={columnSettings}
                            module={module}
                            onToggle={toggleColumn}
                            onMove={moveColumn}
                        />
                    </div>
                </div>
            </div>

            {/* bulk delete toolbar */}
            {showActions === true && selectedIds.length > 0 && (
                <div className="flex animate-in items-center justify-between rounded-lg border bg-muted/50 p-2 px-4 fade-in slide-in-from-top-1">
                    <span className="text-sm font-medium">
                        {selectedIds.length}&nbsp;&nbsp;
                        {module.model_name.toLowerCase()}
                        {selectedIds.length > 1 && 's'} selected
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
            <div className="w-full overflow-hidden rounded-md border">
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
                                        className="cursor-pointer border-2 border-foreground"
                                    />
                                </TableHead>
                            )}

                            {visibleFields.map((field, index) => {
                                const isSorted =
                                    currentSortColumn === field.key;

                                return (
                                    <TableHead
                                        key={field.key}
                                        className={`font-semibold ${index === 0 ? 'text-left' : 'text-center'}`}
                                    >
                                        <div
                                            className={`flex items-center ${index === 0 ? 'justify-start' : 'justify-center'}`}
                                        >
                                            {field.sort ? (
                                                <Button
                                                    onClick={() =>
                                                        handleSort(field.key)
                                                    }
                                                    variant="ghost"
                                                    className={`group mx-auto flex w-fit cursor-pointer items-center justify-center gap-2 transition-colors ${isSorted ? 'text-foreground' : 'text-foreground/50'}`}
                                                >
                                                    <span className="text-foreground">
                                                        {field.name}
                                                    </span>

                                                    {isSorted ? (
                                                        currentSortDirection ===
                                                        'asc' ? (
                                                            <ArrowUp
                                                                size={14}
                                                                className="animate-in text-primary zoom-in-50"
                                                            />
                                                        ) : (
                                                            <ArrowDown
                                                                size={14}
                                                                className="animate-in text-primary zoom-in-50"
                                                            />
                                                        )
                                                    ) : (
                                                        <ArrowUpDown
                                                            size={14}
                                                            className="text-muted-foreground group-hover:text-foreground"
                                                        />
                                                    )}
                                                </Button>
                                            ) : (field.input_type ===
                                                  'select' ||
                                                  'manualSelect') &&
                                              field.options ? (
                                                <ReusableFilter
                                                    field={field}
                                                    currentFilters={filters}
                                                />
                                            ) : (
                                                <span>{field.name}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                );
                            })}

                            {showActions === true && (
                                <TableHead className="text-center font-semibold">
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
                                                className="cursor-pointer border-[1.5px] border-foreground"
                                                checked={selectedIds.includes(
                                                    row.id,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelectRow(row.id)
                                                }
                                            />
                                        </TableCell>
                                    )}

                                    {visibleFields.map((field, index) => (
                                        <TableCell
                                            key={field.key}
                                            className={
                                                index === 0
                                                    ? 'text-left'
                                                    : 'text-center'
                                            }
                                        >
                                            <DataTableCell
                                                field={field}
                                                row={row}
                                            />
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
                                                    className="text-destructive-foreground hover:bg-destructive/50 hover:text-destructive-foreground"
                                                    onClick={() =>
                                                        handleDelete(row.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleFields.length + 2}
                                    className="h-24 text-center text-muted-foreground"
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
