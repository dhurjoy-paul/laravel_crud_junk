import CommonModule from '@/components/modules/common_module/CommonModule';
import { ModuleConfig } from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import posts from '@/routes/posts';
import { BreadcrumbItem, Category, PaginatedData, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Posts',
        href: posts.index().url,
    },
];

export default function Posts({
    categories,
    posts: allPosts,
    filters,
}: {
    categories: Category[];
    posts: PaginatedData<Post>;
    filters?: any;
}) {
    const PostModule: ModuleConfig = {
        module_name: 'Posts',
        route_name: '/posts',
        model_name: 'Post',
        filter_name: 'category',
        fields: [
            { name: 'Title', key: 'title', input_type: 'text', form_sn: 1 },
            {
                name: 'Status',
                key: 'status',
                input_type: 'text',
                custom_style: 'badge',
                form_hide: true,
            },
            {
                name: 'Category',
                key: 'category_name',
                input_type: 'select',
                custom_style: 'badge',
                options: categories,
                form_sn: 2,
            },
            {
                name: 'Content',
                key: 'content',
                input_type: 'textarea',
                form_sn: 3,
            },
            {
                name: 'Image',
                key: 'image',
                input_type: 'file',
                form_sn: 4,
                table_hide: true,
            },
        ],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <CommonModule
                    module={PostModule}
                    filters={filters}
                    categories={categories}
                    items={allPosts}
                />
            </div>
        </AppLayout>
    );
}
