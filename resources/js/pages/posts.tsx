import Pagination from '@/components/custom/Pagination';
import AppLayout from '@/layouts/app-layout';
import { posts } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: posts().url,
    },
];

interface Post {
    id: number;
    image: string;
    title: string;
    slug: string;
    content: string;
    category_id: number;
    user_id: number;
    published_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    per_page: number;
    current_page: number;
    path: string;
    total: number;
    last_page: number;

    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    posts: PaginatedData<Post>;
}

export default function Posts({ categories, posts }: Props) {
    // console.log(posts);
    const postItems = posts.data;
    return (
        <AppLayout breadcrumbs={breadcrumbs} create_post={true}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {postItems.map((post) =>
                        post ? (
                            <Link
                                key={post.id}
                                href={post.slug}
                                className="border-default flex flex-col items-center rounded-md border bg-card px-3 py-1 shadow-xs md:max-w-xl md:flex-row"
                            >
                                {/* <img src={image} alt={title}
                                    className="mb-4 md:mb-0 rounded-base w-full md:w-48 h-64 md:h-auto object-cover"
                                /> */}
                                <div className="flex flex-col justify-between leading-normal md:p-4">
                                    <h5 className="text-heading mb-2 text-2xl font-bold tracking-tight">
                                        {post.title}
                                    </h5>
                                    <p className="text-body mb-6 line-clamp-3">
                                        {post.content}
                                    </p>
                                    <div>
                                        <button
                                            type="button"
                                            className="border-default-medium text-body box-border inline-flex w-auto items-center rounded-md border bg-primary px-4 py-2.5 text-sm leading-5 font-medium text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary-foreground hover:text-primary focus:outline-none"
                                        >
                                            Read more
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <p className="flex items-center justify-center font-medium">
                                No post found !!
                            </p>
                        ),
                    )}
                </div>

                <Pagination links={posts.links} />
            </div>
        </AppLayout>
    );
}
