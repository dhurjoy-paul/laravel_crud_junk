import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import DataTable from './DataTable';
import FormDrawer from './FormDrawer';
import Pagination from './Pagination';
import Search from './Search';
import { ModuleConfig, PaginatedData } from './types';

export default function CommonModule({
    module,
    // categories,
    items: allItems,
    filters,
}: {
    module: ModuleConfig;
    // categories?: any[];
    items: PaginatedData<any>;
    filters?: any;
}) {
    const { data, ...meta } = allItems;
    const lowerCaseModuleName = module.module_name.toLowerCase();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const handleEditClick = (item: any) => {
        setEditingItem(item);
        setIsDrawerOpen(true);
    };

    const handleCreateClick = () => {
        setEditingItem(null);
        setIsDrawerOpen(true);
    };

    return (
        <>
            <Head title={module.module_name} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto mt-5 flex w-full items-center justify-between">
                    {/* reusable search component */}
                    <Search
                        filters={filters}
                        paramName="search"
                        placeholder={`Search ${lowerCaseModuleName}...`}
                        className="max-w-sm"
                    />
                    <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleCreateClick}
                    >
                        Add New {module.model_name}
                    </Button>
                </div>

                {/* reusable table component */}
                <DataTable
                    module={module}
                    allData={data}
                    onEdit={handleEditClick}
                    filters={filters}
                />

                {/* reusable pagination component */}
                <Pagination filters={filters} meta={meta} />
            </div>

            {/* reusable from drawer for both edit and create */}
            <FormDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                module={module}
                item={editingItem}
            />
        </>
    );
}
