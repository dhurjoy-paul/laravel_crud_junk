import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { FilterX, X } from 'lucide-react';

export function ActiveFilters({
    fields,
    filters,
}: {
    fields: any;
    filters: any;
}) {
    const activeEntries = Object.entries(filters).filter(([key, value]) => {
        const isField = fields.some((f: any) => f.key === key);
        return isField && value && String(value).length > 0;
    });

    const handleRemoveIndividual = (key: string, valueToRemove: string) => {
        const currentVal = filters[key];
        if (!currentVal) return;

        const values = String(currentVal).split(',');
        const newValues = values.filter((v) => v !== valueToRemove);

        router.get(
            window.location.pathname,
            {
                ...filters,
                [key]: newValues.length > 0 ? newValues.join(',') : null,
                page: 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleClearFilters = () => {
        const newParams = { ...filters };
        const filterKeys = fields.map((f: any) => f.key);
        filterKeys.forEach((key: any) => {
            delete newParams[key];
        });
        newParams.page = 1;

        router.get(window.location.pathname, newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-muted-foreground uppercase">
                Filters:
            </span>
            {activeEntries.length !== 0 &&
                activeEntries.map(([key, value]) => {
                    const field = fields.find((f: any) => f.key === key);
                    return (
                        <div
                            key={key}
                            className="flex items-center gap-2 rounded-md border border-muted-foreground/20 bg-muted/50 px-2 py-1"
                        >
                            <span className="text-xs font-semibold text-primary">
                                {field?.name}:
                            </span>
                            <div className="flex gap-1">
                                {String(value)
                                    .split(',')
                                    .map((v) => (
                                        <Badge
                                            key={`${key}-${v}`}
                                            variant="secondary"
                                            onClick={() =>
                                                handleRemoveIndividual(key, v)
                                            }
                                            className="group flex cursor-pointer items-center gap-1 px-2 py-1 font-normal text-foreground hover:bg-muted-foreground/15"
                                        >
                                            {v}
                                            <button
                                                onClick={() =>
                                                    handleRemoveIndividual(
                                                        key,
                                                        v,
                                                    )
                                                }
                                                className="ml-1 cursor-pointer rounded-full ring-offset-background transition-colors outline-none group-hover:bg-muted-foreground/30 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            >
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            {activeEntries.length > 0 && (
                <Button
                    variant="link"
                    onClick={handleClearFilters}
                    className="h-auto cursor-pointer p-0 text-xs text-destructive-foreground"
                >
                    <FilterX />
                    Clear all
                </Button>
            )}
        </div>
    );
}
