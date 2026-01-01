import CategoryFilter from '@/components/custom/categoryFilter';
import Pagination from '@/components/custom/Pagination';
import PostsTable from '@/components/custom/PostsTable';
import Search from '@/components/custom/search';
import AppLayout from '@/layouts/app-layout';
import posts from '@/routes/posts';

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
    const PostModule = {
        module_name: 'Posts',
        fields: [
            { name: 'Title', input_type: 'text' },
            { name: 'Status', input_type: 'text', style: 'border-1' },
            { name: 'Category', input_type: 'text', style: 'border-2' },
            { name: 'Content', input_type: 'text' },
        ],
        route_name: '/posts',
        model_name: 'Post',
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
                <PostsTable posts={allPosts} />

                {/* reusable pagination component */}
                <Pagination meta={allPosts} />
            </div>
        </AppLayout>
    );
}
