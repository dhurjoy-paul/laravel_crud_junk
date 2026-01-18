import CommonModule from '@/components/modules/common_module/CommonModule';
import {
    ModuleConfig,
    PaginatedData,
} from '@/components/modules/common_module/types';
import AppLayout from '@/layouts/app-layout';
import posts from '@/routes/posts';
import { BreadcrumbItem, Category, Post } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'All Posts',
        href: posts.index().url,
    },
];

export default function Posts({
    categories,
    items: allPosts,
    filters,
}: {
    categories: Category[];
    items: PaginatedData<Post>;
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
                name: 'ID',
                key: 'id',
                input_type: 'number',
                custom_style: 'badge',
                form_hide: true,
                sort: true,
            },
            {
                name: 'Category',
                key: 'category_id',
                show_key: 'category_name',
                input_type: 'select',
                custom_style: 'badge',
                options: categories,
                option_value: 'name',
                form_sn: 2,
            },
            {
                name: 'Content',
                key: 'content',
                input_type: 'tinymce',
                custom_style: 'truncate',
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
                    items={allPosts}
                />
            </div>
        </AppLayout>
    );
}
