import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import headphones from '@/routes/headphones';
import { BreadcrumbItem, Headphone } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    // {
    //     title: 'Inventory',
    //     href: '#',
    // },
    {
        title: 'Headphones',
        href: headphones.index().url,
    },
];

export default function Headphones({
    items: allHeadphones,
    filters,
}: {
    items: PaginatedData<Headphone>;
    filters?: any;
}) {
    const HeadphoneModule: ModuleConfig = {
        module_name: 'Headphones',
        route_name: '/headphones',
        model_name: 'Headphone',
        fields: [
            {
                name: 'Brand',
                key: 'brand',
                input_type: 'text',
                form_sn: 1,
                sort: true,
            },
            {
                name: 'Model Name',
                key: 'model_name',
                input_type: 'text',
                form_sn: 2,
                sort: true,
            },
            {
                name: 'Type',
                key: 'type',
                input_type: 'manualSelect',
                options: [
                    { id: 'Over-Ear', name: 'Over-Ear' },
                    { id: 'On-Ear', name: 'On-Ear' },
                    { id: 'In-Ear', name: 'In-Ear' },
                ],
                form_sn: 3,
            },
            {
                name: 'Connection',
                key: 'connection_type',
                input_type: 'manualSelect',
                options: [
                    { id: 'Wired', name: 'Wired' },
                    { id: 'Wireless', name: 'Wireless' },
                    { id: 'Hybrid', name: 'Hybrid' },
                ],
                form_sn: 4,
            },
            {
                name: 'Price',
                key: 'price',
                input_type: 'number',
                form_sn: 5,
                sort: true,
            },
            {
                name: 'Stock',
                key: 'stock_quantity',
                input_type: 'number',
                form_sn: 6,
                sort: true,
            },
            {
                name: 'Status',
                key: 'status',
                input_type: 'manualSelect',
                custom_style: 'badge',
                options: [
                    { id: 'In Stock', name: 'In Stock' },
                    { id: 'Out of Stock', name: 'Out of Stock' },
                    { id: 'Pre-order', name: 'Pre-order' },
                ],
                form_sn: 7,
            },
            {
                name: 'Mic',
                key: 'has_microphone',
                input_type: 'checkbox',
                form_sn: 8,
            },
            {
                name: 'ANC',
                key: 'is_noise_cancelling',
                input_type: 'checkbox',
                form_sn: 9,
            },
            {
                name: 'Image',
                key: 'image_url',
                input_type: 'file',
                form_sn: 10,
                // table_hide: true,
            },
            {
                name: 'Rack Location',
                key: 'location_rack',
                input_type: 'text',
                form_sn: 11,
            },
            {
                name: 'Color',
                key: 'color',
                input_type: 'text',
                form_sn: 12,
            },
            {
                name: 'Description',
                key: 'description',
                input_type: 'textarea',
                form_sn: 13,
                table_hide: true,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <CommonModule
                    module={HeadphoneModule}
                    filters={filters}
                    items={allHeadphones}
                />
            </div>
        </AppLayout>
    );
}
