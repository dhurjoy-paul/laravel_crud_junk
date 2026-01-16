import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { router } from '@inertiajs/react';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

export function ReusableFilter({
    field,
    currentFilters,
}: {
    field: any;
    currentFilters: any;
}) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

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
        <Popover open={open} onOpenChange={setOpen}>
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
                className="w-fit min-w-[200px] overflow-hidden border-muted/40 p-0 shadow-2xl"
                align="center"
            >
                <div className="flex items-center justify-between border-b border-muted/30 bg-muted/20 p-2.5 px-3">
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        {field.name}
                    </span>
                    {activeValues.length > 0 && (
                        <button
                            onClick={() => updateFilters([])}
                            className="cursor-pointer text-[10px] font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                            RESET
                        </button>
                    )}
                </div>

                <Command className="bg-transparent">
                    <div className="relative flex items-center border-b border-muted/30 px-2">
                        <CommandInput
                            placeholder={`Search ${field.name}...`}
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="h-9 border-none text-sm focus:ring-0"
                        />
                        {searchValue && (
                            <button
                                onClick={() => setSearchValue('')}
                                type="button"
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                    <CommandList className="custom-scrollbar max-h-[250px] overflow-y-auto p-1.5">
                        <CommandEmpty className="py-4 text-center text-xs text-muted-foreground">
                            No {field.name.toLowerCase()} found.
                        </CommandEmpty>
                        <CommandGroup>
                            {field.options?.map((opt: any) => {
                                const isSelected = activeValues.includes(
                                    String(opt.name),
                                );
                                return (
                                    <CommandItem
                                        key={opt.name}
                                        value={opt.name}
                                        onSelect={() =>
                                            toggleFilter(String(opt.name))
                                        }
                                        className={`group mb-0.5 flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition-all aria-selected:bg-muted ${
                                            isSelected
                                                ? 'bg-primary/10 font-medium text-primary'
                                                : 'text-foreground/70 hover:text-foreground'
                                        }`}
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
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
