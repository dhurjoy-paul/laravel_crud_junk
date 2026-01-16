import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useFilters } from './hooks/useFilters';

export function ActiveFilters({
    fields,
    filters,
}: {
    fields: any;
    filters: any;
}) {
    const { activeEntries, hasActiveFilters, handleRemoveIndividual } =
        useFilters(fields, filters);

    return (
        <div className="flex items-center gap-3">
            <span className="shrink-0 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Active Filters:
            </span>

            {hasActiveFilters && (
                <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto pb-1">
                    {activeEntries.map(([key, value]) => {
                        const field = fields.find((f: any) => f.key === key);
                        return (
                            <div
                                key={key}
                                className="flex shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1"
                            >
                                <span className="text-[10px] font-bold text-primary/70 uppercase">
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
                                                    handleRemoveIndividual(
                                                        key,
                                                        v,
                                                    )
                                                }
                                                className="group flex cursor-pointer items-center gap-1 border-none bg-background px-2 py-0 text-[11px] font-medium shadow-sm"
                                            >
                                                {v}
                                                <X
                                                    size={10}
                                                    className="cursor-pointer opacity-50 transition-opacity hover:opacity-100"
                                                    onClick={() =>
                                                        handleRemoveIndividual(
                                                            key,
                                                            v,
                                                        )
                                                    }
                                                />
                                            </Badge>
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
