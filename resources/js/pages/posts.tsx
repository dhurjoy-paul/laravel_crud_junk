import CommonModule from '@/components/modules/common_module/CommonModule';
import { ModuleConfig } from '@/components/modules/common_module/types';
import { Category, PaginatedData, Post } from '@/types';

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
        <div>
            <CommonModule
                module={PostModule}
                filters={filters}
                categories={categories}
                items={allPosts}
            />
        </div>
    );
}
