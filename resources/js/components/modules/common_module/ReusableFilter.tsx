import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { router } from '@inertiajs/react';
import { Filter } from 'lucide-react';

export function ReusableFilter({
    field,
    currentFilters,
}: {
    field: any;
    currentFilters: any;
}) {
    const activeValues = currentFilters[field.key]
        ? String(currentFilters[field.key]).split(',')
        : [];

    const updateFilters = (newValues: string[]) => {
        router.get(
            window.location.pathname,
            {
                ...currentFilters,
                [field.key]: newValues.length > 0 ? newValues.join(',') : null,
                page: 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const toggleFilter = (val: string) => {
        const newValues = activeValues.includes(val)
            ? activeValues.filter((v) => v !== val)
            : [...activeValues, val];
        updateFilters(newValues);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={`mx-auto flex w-fit cursor-pointer items-center justify-center gap-2 data-[state=open]:bg-accent ${activeValues.length > 0 ? 'text-foreground' : 'text-foreground/50'}`}
                >
                    <span className="text-foreground">{field.name}</span>
                    <Filter
                        size={12}
                        fill={activeValues.length > 0 ? 'currentColor' : 'none'}
                    />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-fit min-w-[180px] overflow-hidden border-muted/40 p-0 shadow-2xl"
                align="center"
            >
                <div className="flex items-center justify-between bg-muted/20 p-2.5 px-3">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {field.name}
                    </span>
                    {activeValues.length > 0 && (
                        <button
                            onClick={() => updateFilters([])}
                            className="text-[10px] font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            RESET
                        </button>
                    )}
                </div>

                <div className="p-1.5">
                    {field.options?.map((opt: any) => {
                        const isSelected = activeValues.includes(
                            String(opt.name),
                        );
                        return (
                            <div
                                key={opt.name}
                                className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition-all ${
                                    isSelected
                                        ? 'bg-primary/10 font-medium text-primary'
                                        : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                }`}
                                onClick={() => toggleFilter(String(opt.name))}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                                            isSelected
                                                ? 'scale-100 bg-primary'
                                                : 'scale-0 bg-transparent group-hover:scale-100 group-hover:bg-muted-foreground/30'
                                        }`}
                                    />
                                    <span>{opt.name}</span>
                                </div>
                                {isSelected && (
                                    <div className="text-[10px] opacity-60">
                                        ✓
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
