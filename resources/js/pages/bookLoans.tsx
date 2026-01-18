import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import bookLoans from '@/routes/bookloans';
import { BookLoan, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Book Loans',
        href: bookLoans.index().url,
    },
];

export default function BookLoans({
    items: allLoans,
    students,
    books,
    filters,
}: {
    items: PaginatedData<BookLoan>;
    students: any;
    books: any;
    filters?: any;
}) {
    const LoanModule: ModuleConfig = {
        module_name: 'Book Loans',
        route_name: '/bookLoans',
        model_name: 'BookLoan',
        fields: [
            {
                name: 'Student Name',
                key: 'student_id',
                show_key: 'student_name',
                input_type: 'select',
                options: students,
                option_value: 'name', // students use 'name'
                form_sn: 1,
            },
            {
                name: 'Card No',
                key: 'student.student_card_id',
            },
            {
                name: 'Book Title',
                key: 'book_id',
                show_key: 'book_title',
                input_type: 'select',
                options: books,
                option_value: 'title', // books use 'title'
                form_sn: 2,
            },
            {
                name: 'Author',
                key: 'book.author',
            },
            {
                name: 'ISBN',
                key: 'book.isbn',
            },
            {
                name: 'Loan Date',
                key: 'loan_date',
                input_type: 'datetime-local',
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
                required: false,
                form_sn: 5,
                sort: true,
            },
            {
                name: 'Created At',
                key: 'created_at',
                input_type: 'datetime-local',
                form_hide: true,
                table_hide: true,
            },
            {
                name: 'Genre',
                key: 'book.genre',
            },
            {
                name: 'Email',
                key: 'student.email',
                table_hide: true,
            },
            {
                name: 'Image',
                key: 'student.image',
                table_hide: true,
            },
            {
                name: 'Stu. Status',
                key: 'student.is_active',
                custom_style: 'badge',
                table_hide: true,
            },
            {
                name: 'Borrow Limit',
                key: 'student.max_borrow_limit',
                table_hide: true,
            },
            {
                name: 'Book Image',
                key: 'book.image',
                table_hide: true,
            },
            {
                name: 'Quantity',
                key: 'book.quantity',
                table_hide: true,
            },
            {
                name: 'Avail. Copies',
                key: 'book.available_copies',
                table_hide: true,
            },
            {
                name: 'Floor',
                key: 'book.floor',
                table_hide: true,
            },
            {
                name: 'Section',
                key: 'book.section',
                table_hide: true,
            },
            {
                name: 'Rack',
                key: 'book.rack',
                table_hide: true,
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
