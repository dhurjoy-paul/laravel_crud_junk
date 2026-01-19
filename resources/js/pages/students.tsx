import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import students from '@/routes/students';
import { BreadcrumbItem, Student } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: students.index().url,
    },
];

export default function Students({
    items: allStudents,
    filters,
}: {
    items: PaginatedData<Student>;
    filters?: any;
}) {
    const StudentModule: ModuleConfig = {
        module_name: 'Students',
        route_name: '/students',
        model_name: 'Student',
        fields: [
            {
                name: 'Student Name',
                key: 'name',
                input_type: 'text',
                form_sn: 1,
            },
            {
                name: 'Email Address',
                key: 'email',
                input_type: 'email',
                form_sn: 2,
            },
            {
                name: 'Student Card ID',
                key: 'student_card_id',
                input_type: 'text',
                form_sn: 3,
                sort: true,
            },
            {
                name: 'Borrow Limit',
                key: 'max_borrow_limit',
                input_type: 'number',
                form_sn: 4,
                sort: true,
            },
            {
                name: 'Account Status',
                key: 'is_active',
                input_type: 'select',
                custom_style: 'badge',
                options: [
                    { id: 'Active', name: 'Active' },
                    { id: 'Inactive', name: 'Inactive' },
                ],
                option_value: 'name',
                form_sn: 5,
            },
            {
                name: 'Image',
                key: 'image',
                input_type: 'file',
                form_sn: 6,
                table_hide: true,
            },
            {
                name: 'Added At', // coming from created at
                key: 'created_at',
                input_type: 'datetime-local',
                form_hide: true,
                sort: true,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <CommonModule
                    module={StudentModule}
                    filters={filters}
                    items={allStudents}
                />
            </div>
        </AppLayout>
    );
}
