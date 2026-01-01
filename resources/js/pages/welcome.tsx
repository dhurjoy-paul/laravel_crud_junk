import AppLogo from '@/components/app-logo';
import CategoryFilter from '@/components/custom/categoryFilter';
import Container from '@/components/custom/container';
import Pagination from '@/components/custom/Pagination';
import PostsContent from '@/components/custom/postsContent';
import Search from '@/components/custom/search';
import { dashboard, home, login, register } from '@/routes';
import { Category, PaginatedData, Post, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
    categories,
    posts,
    filters,
}: {
    canRegister?: boolean;
    categories: Category[];
    posts: PaginatedData<Post>;
    filters?: any;
}) {
    const { auth } = usePage<SharedData>().props;
    const postItems = posts.data;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background p-6 text-foreground lg:p-8">
                <header className="mb-6 flex w-full max-w-[335px] items-center justify-between gap-5 text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    {/* app logo */}
                    <Link
                        href={home({})}
                        prefetch
                        className="mr-3 flex shrink-0 items-center"
                    >
                        <AppLogo />
                    </Link>

                    <div className="flex w-full items-center">
                        <Search filters={filters} />
                    </div>

                    {/* nav links */}
                    <nav className="flex shrink-0 items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <Container>
                    <CategoryFilter
                        categories={categories}
                        filters={filters}
                        currentCategory={filters?.category}
                    />
                    <PostsContent posts={posts} grid={1} />

                    <Pagination meta={posts} />
                </Container>
            </div>
        </>
    );
}
