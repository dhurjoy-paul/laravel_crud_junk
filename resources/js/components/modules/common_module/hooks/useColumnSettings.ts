import { useEffect, useMemo, useState } from 'react';
import { ModuleConfig, ModuleField } from '../types';

export function useTableSettings(module: ModuleConfig) {
    const storageKey = `table_view_settings_${module.module_name.toLowerCase()}`;

    const [columnSettings, setColumnSettings] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved
            ? JSON.parse(saved)
            : module.fields.map((f) => ({
                  key: f.key,
                  visible: !f.table_hide,
              }));
    });

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(columnSettings));
    }, [columnSettings, storageKey]);

    const orderedFields = useMemo(
        () =>
            columnSettings
                .map((s: any) => module.fields.find((f) => f.key === s.key))
                .filter(Boolean) as ModuleField[],
        [columnSettings, module.fields],
    );

    const visibleFields = useMemo(
        () =>
            orderedFields.filter(
                (f) =>
                    columnSettings.find((s: any) => s.key === f.key)?.visible,
            ),
        [orderedFields, columnSettings],
    );

    const toggleColumn = (key: string) => {
        setColumnSettings((prev: any) =>
            prev.map((s: any) =>
                s.key === key ? { ...s, visible: !s.visible } : s,
            ),
        );
    };

    const moveColumn = (index: number, direction: 'up' | 'down') => {
        const newSettings = [...columnSettings];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= newSettings.length) return;
        [newSettings[index], newSettings[target]] = [
            newSettings[target],
            newSettings[index],
        ];
        setColumnSettings(newSettings);
    };

    const reorderColumns = (newOrder: any[]) => {
        setColumnSettings(newOrder);
    };

    return {
        columnSettings,
        visibleFields,
        toggleColumn,
        moveColumn,
        reorderColumns,
    };
}
