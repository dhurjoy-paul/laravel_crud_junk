import Pagination from '@/components/custom/Pagination';
import PostsContent from '@/components/custom/postscontent';
import AppLayout from '@/layouts/app-layout';
import { posts } from '@/routes';
import { Category, PaginatedData, Post, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: posts().url,
    },
];

export default function Posts({
    categories,
    posts,
}: {
    categories: Category[];
    posts: PaginatedData<Post>;
}) {
    const postItems = posts.data;
    return (
        <AppLayout breadcrumbs={breadcrumbs} create_post={true}>
            <Head title="Posts" />
            <div className="flex flex-col flex-1 gap-4 p-4 rounded-xl h-full overflow-x-auto">
                {/* tabs */}
                {/* <div>
                    <ul className="[&>li_a]:inline-block flex flex-wrap justify-center [&>li_a]:bg-secondary [&>li_a]:hover:bg-primary [&>li_a]:active:bg-primary [&>li]:me-2 [&>li_a]:px-4 [&>li_a]:py-2.5 [&>li_a]:rounded-md font-medium text-body [&>li_a]:hover:text-primary-foreground [&>li_a]:active:text-primary-foreground text-sm text-center">
                        <li>
                            <Link href="#" className="active">
                                All
                            </Link>
                        </li>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link href="#">{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div> */}

                {/* posts */}
                <PostsContent posts={posts} grid={2} actions />

                <Pagination links={posts.links} />
            </div>
        </AppLayout>
    );
}
