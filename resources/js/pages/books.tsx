import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import books from '@/routes/books';
import { Book, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Books',
        href: books.index().url,
    },
];

export default function Books({
    items: allBooks,
    filters,
}: {
    items: PaginatedData<Book>;
    filters?: any;
}) {
    const BookModule: ModuleConfig = {
        module_name: 'Books',
        route_name: '/books',
        model_name: 'Book',
        fields: [
            {
                name: 'Title',
                key: 'title',
                input_type: 'text',
                form_sn: 1,
                custom_style: 'truncate',
                align: 'left',
            },
            {
                name: 'Author',
                key: 'author',
                input_type: 'text',
                form_sn: 2,
            },
            {
                name: 'ISBN',
                key: 'isbn',
                input_type: 'number',
                form_sn: 3,
                sort: true,
            },
            {
                name: 'Genre',
                key: 'genre',
                input_type: 'select',
                custom_style: 'badge',
                options: genreOptions, // coming from this file's bottom not from DB
                option_value: 'name',
                form_sn: 3,
            },
            {
                name: 'Total Quantity',
                key: 'quantity',
                input_type: 'number',
                form_sn: 5,
                sort: true,
            },
            {
                name: 'Available',
                key: 'available_copies',
                input_type: 'number',
                form_sn: 6,
                sort: true,
            },
            {
                name: 'Floor',
                key: 'floor',
                input_type: 'text',
                form_sn: 7,
            },
            {
                name: 'Section',
                key: 'section',
                input_type: 'text',
                form_sn: 8,
            },
            {
                name: 'Rack',
                key: 'rack',
                input_type: 'text',
                form_sn: 9,
            },
            {
                name: 'Price',
                key: 'price',
                input_type: 'number',
                form_sn: 10,
                sort: true,
            },
            {
                name: 'Published Date',
                key: 'published_date',
                input_type: 'date',
                form_sn: 11,
            },
            {
                name: 'Book Image',
                key: 'image',
                input_type: 'file',
                form_sn: 12,
                table_hide: true,
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
                    module={BookModule}
                    filters={filters}
                    items={allBooks}
                />
            </div>
        </AppLayout>
    );
}

const genreOptions = [
    {
        id: 'Action and Adventure',
        name: 'Action and Adventure',
    },
    { id: 'Art & Photography', name: 'Art & Photography' },
    { id: 'Biography', name: 'Biography' },
    {
        id: 'Business & Economics',
        name: 'Business & Economics',
    },
    { id: "Children's Fiction", name: "Children's Fiction" },
    { id: 'Classic', name: 'Classic' },
    { id: 'Contemporary', name: 'Contemporary' },
    { id: 'Cookbooks', name: 'Cookbooks' },
    { id: 'Crime', name: 'Crime' },
    { id: 'Dystopian', name: 'Dystopian' },
    { id: 'Fantasy', name: 'Fantasy' },
    { id: 'Graphic Novel', name: 'Graphic Novel' },
    { id: 'History', name: 'History' },
    { id: 'Horror', name: 'Horror' },
    { id: 'Humor', name: 'Humor' },
    { id: 'Literary Fiction', name: 'Literary Fiction' },
    { id: 'Memoir', name: 'Memoir' },
    { id: 'Mystery', name: 'Mystery' },
    { id: 'Non-fiction', name: 'Non-fiction' },
    { id: 'Philosophy', name: 'Philosophy' },
    { id: 'Poetry', name: 'Poetry' },
    { id: 'Psychology', name: 'Psychology' },
    { id: 'Science', name: 'Science' },
    { id: 'Science Fiction', name: 'Science Fiction' },
    { id: 'Self-Help', name: 'Self-Help' },
    { id: 'Short Story', name: 'Short Story' },
    { id: 'Spirituality', name: 'Spirituality' },
    { id: 'Thriller', name: 'Thriller' },
    { id: 'Travel', name: 'Travel' },
    { id: 'True Crime', name: 'True Crime' },
    { id: 'Western', name: 'Western' },
];
