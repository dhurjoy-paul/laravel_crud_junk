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
import { useState } from 'react';

export default function ComboboxField({
    field,
    currentKey,
    currentValue,
    onSelect,
}: {
    field: any;
    currentKey: string;
    currentValue: string;
    onSelect: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {currentValue
                        ? field.options?.find(
                              (opt: any) => opt.id.toString() === currentValue,
                          )?.name
                        : `Select ${field.name}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="popover-content-width-same-as-its-trigger p-0"
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
                            {field.options?.map((opt: any) => (
                                <CommandItem
                                    key={opt.id}
                                    value={opt.name} // This is what Command filters on
                                    onSelect={() => {
                                        onSelect(opt.id.toString());
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            currentValue === opt.id.toString()
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    {opt.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
