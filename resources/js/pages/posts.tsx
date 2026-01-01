import CategoryFilter from '@/components/custom/categoryFilter';
import Pagination from '@/components/custom/Pagination';
import Search from '@/components/custom/search';
import AppLayout from '@/layouts/app-layout';
import posts from '@/routes/posts';
import { Head } from '@inertiajs/react';

import DataTable from '@/components/modules/common_module/DataTable';

import { Button } from '@/components/ui/button';
import { Category, PaginatedData, Post, type BreadcrumbItem } from '@/types';
import { useState } from 'react';
import PostFormDrawer from './post/PostFormDrawer';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: posts.index().url,
    },
];

export interface ModuleField {
    name: string; // table header & form labels
    key: string; // this is DB column name ('published_at', 'title')
    input_type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
    css_style?: string; // custom CSS classes
    custom_style?: string | 'badge'; // custom name style
}

export interface ModuleConfig {
    module_name: string; // Posts
    route_name: string; // '/posts'  // also have to make a method like /posts/bulk
    model_name: string; // Post
    fields: ModuleField[];
}

export default function Posts({
    categories,
    posts: allPosts,
    filters,
}: {
    categories: Category[];
    posts: PaginatedData<Post>;
    filters?: any;
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    const handleEditClick = (post: Post) => {
        setEditingPost(post);
        setIsDrawerOpen(true);
    };

    const handleCreateClick = () => {
        setEditingPost(null);
        setIsDrawerOpen(true);
    };

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
            <Button onClick={handleCreateClick}>Create New Post</Button>
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

                {/* reusable table component */}
                <DataTable
                    config={PostModule}
                    allData={allPosts}
                    onEdit={handleEditClick}
                />

                {/* reusable pagination component */}
                <Pagination meta={allPosts} />
            </div>

            {/* not reusable, but a from drawer for both edit and create */}
            <PostFormDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                post={editingPost}
                categories={categories}
            />
        </AppLayout>
    );
}
