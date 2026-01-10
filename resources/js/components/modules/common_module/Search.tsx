import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Search({
    filters,
    paramName = 'search',
    placeholder,
    routeName,
    className,
}: {
    filters: any;
    paramName?: string;
    placeholder?: string;
    routeName?: string;
    className?: string;
}) {
    const searchedText = filters?.[paramName] ?? '';
    const [value, setValue] = useState(searchedText);
    const lastSentValue = useRef(searchedText);

    useEffect(() => {
        setValue(searchedText);
        lastSentValue.current = searchedText;
    }, [searchedText]);

    const handleClear = () => {
        setValue('');
    };

    useEffect(() => {
        if (value === lastSentValue.current) return;

        const searchDelayFn = setTimeout(() => {
            lastSentValue.current = value;

            router.get(
                routeName || window.location.pathname,
                {
                    ...filters,
                    [paramName]: value || undefined,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(searchDelayFn);
    }, [value]);

    const handleClearFilters = () => {
        router.get(
            window.location.pathname,
            {},
            { replace: true, preserveScroll: true },
        );
    };

    return (
        <div className="flex w-full items-center gap-2">
            <div className={`relative w-full ${className}`}>
                {' '}
                <Input
                    type="text"
                    placeholder={placeholder || `Search ${paramName}...`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full rounded-md pr-10 ring-[1.5px] ring-input`}
                />
                {/* clear btn */}
                {value && (
                    <button
                        onClick={handleClear}
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button
                onClick={handleClearFilters}
                variant="secondary"
                size="sm"
                className="cursor-pointer"
            >
                Clear all filters
            </Button>
        </div>
    );
}
