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

    return (
        <div className={`relative w-full ${className}`}>
            {' '}
            <Input
                type="text"
                placeholder={placeholder || `Search ${paramName}...`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full rounded-md border pr-10`}
            />
            {/* clear btn */}
            {value && (
                <button
                    onClick={handleClear}
                    type="button"
                    className="top-1/2 right-3 absolute hover:bg-accent p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors -translate-y-1/2 cursor-pointer"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
