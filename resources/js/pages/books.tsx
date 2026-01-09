import CommonModule from '@/components/modules/common_module/CommonModule';
import { ModuleConfig } from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import books from '@/routes/books';
import { Book, BreadcrumbItem, Genre, PaginatedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Books',
        href: books.index().url,
    },
];

export default function Books({
    genres,
    books: allBooks,
    filters,
}: {
    genres: Genre[];
    books: PaginatedData<Book>;
    filters?: any;
}) {
    const BookModule: ModuleConfig = {
        module_name: 'Books',
        route_name: '/books',
        model_name: 'Book',
        filter_name: 'genre',
        fields: [
            {
                name: 'Title',
                key: 'title',
                input_type: 'text',
                form_sn: 1,
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
                input_type: 'text',
                form_sn: 3,
                sort: true,
            },
            {
                name: 'Description',
                key: 'description',
                input_type: 'textarea',
                form_sn: 4,
                table_hide: true,
            },
            {
                name: 'Price',
                key: 'price',
                input_type: 'number',
                form_sn: 5,
                sort: true,
            },
            {
                name: 'Quantity',
                key: 'quantity',
                input_type: 'number',
                form_sn: 6,
                sort: true,
            },
            {
                name: 'Cover Image',
                key: 'image',
                input_type: 'file',
                form_sn: 7,
                table_hide: true,
            },
            {
                name: 'Published Date',
                key: 'published_date',
                input_type: 'date',
                form_sn: 8,
                sort: true,
            },
            {
                name: 'Genre',
                key: 'genre_name',
                input_type: 'select',
                form_sn: 9,
                options: genres, // this is actual data
                custom_style: 'badge',
            },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <CommonModule
                    module={BookModule}
                    filters={filters}
                    categories={genres}
                    items={allBooks}
                />
            </div>
        </AppLayout>
    );
}
