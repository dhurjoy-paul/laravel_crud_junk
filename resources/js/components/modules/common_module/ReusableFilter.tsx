import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { FilterItem } from './types';

interface ReusableFilterProps {
    items: FilterItem[];
    activeValue?: string[] | number[] | null;
    filters: any;
    filterKey?: string | any; // 'category', 'genre', 'status'
    allLabel?: string;
}

export default function ReusableFilter({
    items,
    activeValue,
    filters,
    filterKey,
    allLabel = 'All',
}: ReusableFilterProps) {
    const activeIds = activeValue
        ? String(activeValue)
              .split(',')
              .filter((v) => v !== '')
              .map(Number)
        : [];

    const handleFilter = (id: number | null) => {
        let newIds: number[] = [];

        if (id !== null) {
            if (activeIds.includes(id)) {
                newIds = activeIds.filter((item) => item !== id);
            } else {
                newIds = [...activeIds, id];
            }
        }

        router.get(
            window.location.pathname,
            {
                ...filters,
                [filterKey]: newIds.length > 0 ? newIds.join(',') : null,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <div className="mb-6">
            <ul className="flex flex-wrap justify-center gap-2 font-medium text-sm">
                <li>
                    <Button
                        variant={
                            (activeIds.length === 0
                                ? 'default'
                                : 'secondary') as any
                        }
                        size="sm"
                        onClick={() => handleFilter(null)}
                        className="cursor-pointer"
                    >
                        {allLabel}
                    </Button>
                </li>
                {items.map((item) => (
                    <li key={item.id}>
                        <Button
                            variant={
                                (activeIds.includes(item.id)
                                    ? 'default'
                                    : 'secondary') as any
                            }
                            size="sm"
                            onClick={() => handleFilter(item.id)}
                            className="cursor-pointer"
                        >
                            {item.name}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
