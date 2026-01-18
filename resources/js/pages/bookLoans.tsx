import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import bookloans from '@/routes/bookloans';
import { BookLoan, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: bookloans.index().url,
    },
];

export default function BookLoans({
    items: allLoans,
    filters,
}: {
    items: PaginatedData<BookLoan>;
    filters?: any;
}) {
    const LoanModule: ModuleConfig = {
        module_name: 'Book Loans',
        route_name: '/book-loans',
        model_name: 'BookLoan',
        fields: [
            {
                name: 'Student ID',
                key: 'student_id',
                input_type: 'number',
                form_sn: 1,
                sort: true,
            },
            {
                name: 'Book ID',
                key: 'book_id',
                input_type: 'number',
                form_sn: 2,
                sort: true,
            },
            {
                name: 'Loan Date',
                key: 'loan_date',
                input_type: 'date',
                form_sn: 3,
                sort: true,
            },
            {
                name: 'Due Date',
                key: 'due_date',
                input_type: 'date',
                form_sn: 4,
                sort: true,
            },
            {
                name: 'Returned At',
                key: 'returned_date',
                input_type: 'datetime-local',
                form_sn: 5,
                sort: true,
            },
            {
                name: 'Created At',
                key: 'created_at',
                input_type: 'datetime-local',
                form_hide: true,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <CommonModule
                    module={LoanModule}
                    filters={filters}
                    items={allLoans}
                />
            </div>
        </AppLayout>
    );
}
