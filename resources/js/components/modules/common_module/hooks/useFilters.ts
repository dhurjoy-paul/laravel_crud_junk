import { router } from '@inertiajs/react';
import { useMemo } from 'react';

export function useFilters(fields: any[], filters: Record<string, any>) {
    const activeEntries = useMemo(() => {
        return Object.entries(filters).filter(([key, value]) => {
            const isField = fields.some((f) => f.key === key);
            return isField && value && String(value).length > 0;
        });
    }, [fields, filters]);

    const hasActiveFilters = activeEntries.length > 0;

    const handleRemoveIndividual = (key: string, valueToRemove: string) => {
        const currentVal = filters[key];
        if (!currentVal) return;
        const values = String(currentVal).split(',');
        const newValues = values.filter((v) => v !== valueToRemove);

        router.get(
            window.location.pathname,
            {
                ...filters,
                [key]: newValues.length > 0 ? newValues.join(',') : null,
                page: 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const clearFilters = (hardReset = false) => {
        let newParams: Record<string, any> = {};

        if (!hardReset) {
            newParams = { ...filters };
            fields.forEach((f) => {
                delete newParams[f.key];
            });
            newParams.page = 1;
        }

        router.get(window.location.pathname, newParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return {
        activeEntries,
        hasActiveFilters,
        handleRemoveIndividual,
        clearFilters,
    };
}
