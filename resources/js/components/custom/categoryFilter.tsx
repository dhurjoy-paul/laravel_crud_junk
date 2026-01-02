import { router } from '@inertiajs/react';

export default function CategoryFilter({
    categories,
    currentCategory,
    filters,
}: {
    categories: any[];
    currentCategory?: string | number;
    filters: any;
}) {
    const handleFilter = (id: number | null) => {
        router.get(
            window.location.pathname,
            {
                ...filters,
                category: id,
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
            <ul className="flex justify-center gap-2 font-medium text-sm">
                <li>
                    <button
                        onClick={() => handleFilter(null)}
                        className={`inline-block rounded-md px-4 py-2.5 transition-colors ${!currentCategory ? activeClass : inactiveClass}`}
                    >
                        All
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category.id}>
                        <button
                            onClick={() => handleFilter(category.id)}
                            className={`inline-block rounded-md px-4 py-2.5 transition-colors ${Number(currentCategory) === category.id ? activeClass : inactiveClass}`}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
