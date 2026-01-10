import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
// import { FilterItem } from './types';

export interface FilterItem {
    id: number;
    name: string;
}

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
    // console.log(activeValue);

    const activeIds = activeValue
        ? String(activeValue)
              .split(',')
              .filter((v) => v !== '')
              .map(Number)
        : [];
    // console.log(activeIds);

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
            { preserveState: true, replace: true },
        );
    };

    const activeClass = 'bg-primary text-primary-foreground';
    const inactiveClass =
        'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground';

    return (
        <div className="mb-6">
            <ul className="flex flex-wrap justify-center gap-2 font-medium text-sm">
                <li>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleFilter(null)}
                        className={`transition-colors ${
                            activeIds.length === 0 ? activeClass : inactiveClass
                        }`}
                    >
                        {allLabel}
                    </Button>
                </li>
                {items.map((item) => (
                    <li key={item.id}>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleFilter(item.id)}
                            className={`transition-colors ${
                                activeIds.includes(item.id)
                                    ? activeClass
                                    : inactiveClass
                            }`}
                        >
                            {item.name}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
