import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';

export default function Search({ filters }: { filters: any }) {
    const searchedText = filters?.search ?? '';
    const [value, setValue] = useState(searchedText);
    const lastSentValue = useRef(searchedText);

    useEffect(() => {
        setValue(searchedText);
        lastSentValue.current = searchedText;
    }, [filters?.search]);

    useEffect(() => {
        if (value === lastSentValue.current) return;

        const searchDelayFn = setTimeout(() => {
            lastSentValue.current = value;

            router.get(
                window.location.pathname,
                {
                    ...filters,
                    search: value || undefined,
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
        <div className="w-full">
            <Input
                type="text"
                placeholder={
                    filters?.category
                        ? 'Search in this category...'
                        : 'Search all posts...'
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
            />
        </div>
    );
}
