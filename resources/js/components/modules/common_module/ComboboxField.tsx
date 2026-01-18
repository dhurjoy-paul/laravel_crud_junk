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
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ComboboxField({
    field,
    currentValue,
    onSelect,
}: {
    field: any;
    currentValue: string;
    onSelect: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const isRequired = field.required ?? true;

    const getLabel = (opt: any) => {
        if (!opt) return '';
        return opt[field.option_value] || '';
    };

    const selectedOption = field.options?.find(
        (opt: any) => opt.id.toString() === currentValue?.toString(),
    );

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                tabIndex={-1}
                aria-hidden="true"
                required={isRequired}
                value={currentValue || ''}
                onChange={() => {}}
                className="absolute bottom-0 left-1/2 size-[1px] opacity-0"
            />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'w-full justify-between font-normal',
                            !currentValue &&
                                isRequired &&
                                'border-muted-foreground/50',
                        )}
                    >
                        <span className="truncate">
                            {selectedOption
                                ? getLabel(selectedOption)
                                : `Select ${field.name}...`}
                        </span>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                    align="start"
                >
                    <Command>
                        <div className="relative flex items-center border-b">
                            <CommandInput
                                placeholder={`Search ${field.name}...`}
                                value={search}
                                onValueChange={setSearch}
                                className="flex-1 border-none focus:ring-0"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                        <CommandList>
                            <CommandEmpty>No {field.name} found.</CommandEmpty>
                            <CommandGroup>
                                {field.options?.map((opt: any) => {
                                    const label = getLabel(opt);
                                    const id = opt.id.toString();

                                    return (
                                        <CommandItem
                                            key={id}
                                            value={label}
                                            onSelect={() => {
                                                onSelect(id);
                                                setOpen(false);
                                                setSearch('');
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    currentValue?.toString() ===
                                                        id
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            {label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
