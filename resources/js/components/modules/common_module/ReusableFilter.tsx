import { router } from '@inertiajs/react';

interface FilterItem {
    id: number;
    name: string;
}

interface ReusableFilterProps {
    items: FilterItem[];
    activeValue?: string | number | null;
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
    const handleFilter = (id: number | null) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                [filterKey]: id,
                page: 1,
            },
            { preserveState: true, replace: true },
        );
    };

    const activeClass = 'bg-primary text-primary-foreground';
    const inactiveClass =
        'bg-secondary hover:bg-primary hover:text-primary-foreground';

    return (
        <div className="mb-6">
            <ul className="flex flex-wrap justify-center gap-2 font-medium text-sm">
                <li>
                    <button
                        onClick={() => handleFilter(null)}
                        className={`inline-block rounded-md px-4 py-2.5 transition-colors ${
                            !activeValue ? activeClass : inactiveClass
                        }`}
                    >
                        {allLabel}
                    </button>
                </li>
                {items.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => handleFilter(item.id)}
                            className={`inline-block rounded-md px-4 py-2.5 transition-colors ${
                                Number(activeValue) === item.id
                                    ? activeClass
                                    : inactiveClass
                            }`}
                        >
                            {item.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
