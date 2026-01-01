import CategoryFilter from '@/components/custom/categoryFilter';
import Pagination from '@/components/custom/Pagination';
import Search from '@/components/custom/search';
import AppLayout from '@/layouts/app-layout';
import posts from '@/routes/posts';

import DataTable, {
    ModuleConfig,
} from '@/components/modules/common_module/DataTable';

import { Category, PaginatedData, Post, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
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
        fields: [
            { name: 'Title', key: 'title', input_type: 'text' },
            {
                name: 'Status',
                key: 'status',
                input_type: 'text',
                custom_style: 'badge',
            },
            {
                name: 'Category',
                key: 'category_name',
                input_type: 'text',
                custom_style: 'badge',
            },
            { name: 'Content', key: 'content', input_type: 'textarea' },
        ],
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs} create_post={true}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* tabs */}
                <div className="mx-auto mb-4 w-full max-w-fit">
                    <CategoryFilter
                        categories={categories}
                        filters={filters}
                        currentCategory={filters?.category}
                    />

                    {/* reusable search component */}
                    <Search
                        filters={filters}
                        paramName="search"
                        placeholder="Search posts..."
                    />
                </div>

                {/* main table */}
                {/* <PostsTable posts={allPosts} /> */}

                <DataTable config={PostModule} allData={allPosts} />

                {/* reusable pagination component */}
                <Pagination meta={allPosts} />
            </div>
        </AppLayout>
    );
}
