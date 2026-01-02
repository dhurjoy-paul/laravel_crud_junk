import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

import DataTable from '@/components/modules/common_module/DataTable';
import FormDrawer from '@/components/modules/common_module/FormDrawer';
import Pagination from '@/components/modules/common_module/Pagination';
import Search from '@/components/modules/common_module/Search';
import ReusableFilter from './ReusableFilter';
import { ModuleConfig } from './types';

export default function CommonModule({
    module,
    categories,
    items: allItems,
    filters,
}: {
    module: ModuleConfig;
    categories: any[];
    items: PaginatedData<any>;
    filters?: any;
}) {
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
        <AppLayout>
            <Head title={module.module_name} />
            <div className="flex flex-col flex-1 gap-4 p-4 rounded-xl h-full overflow-x-auto">
                {/* tabs */}
                <div className="mx-auto mb-2 w-full max-w-fit">
                    <ReusableFilter
                        items={categories}
                        activeValue={filters.genre}
                        filters={filters}
                        filterKey={module.filter_name}
                    />
                </div>

                <div className="flex justify-between items-center mx-auto mb-4 w-full">
                    {/* reusable search component */}
                    <Search
                        filters={filters}
                        paramName="search"
                        placeholder={`Search ${module.module_name.toLowerCase()}...`}
                        className="max-w-sm"
                    />
                    <Button onClick={handleCreateClick}>
                        Add New {module.model_name}
                    </Button>
                </div>

                {/* reusable table component */}
                <DataTable
                    config={module}
                    allData={allItems}
                    onEdit={handleEditClick}
                />

                {/* reusable pagination component */}
                <Pagination meta={allItems} />
            </div>

            {/* reusable from drawer for both edit and create */}
            <FormDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                module={module}
                item={editingItem}
            />
        </AppLayout>
    );
}
