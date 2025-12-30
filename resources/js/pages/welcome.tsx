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
    // console.log(posts);
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex flex-col items-center bg-background p-6 lg:p-8 min-h-screen text-foreground">
                <header className="not-has-[nav]:hidden flex justify-between items-center gap-5 mb-6 w-full max-w-[335px] lg:max-w-4xl text-sm">
                    {/* app logo */}
                    <Link
                        href={home({})}
                        prefetch
                        className="flex items-center mr-3 shrink-0"
                    >
                        <AppLogo />
                    </Link>

                    <div className="flex items-center w-full">
                        <Search filters={filters} />
                    </div>

                    {/* nav links */}
                    <nav className="flex justify-end items-center gap-4 shrink-0">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block px-5 py-1.5 border border-[#19140035] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b] rounded-sm text-[#1b1b18] dark:text-[#EDEDEC] text-sm leading-normal"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block px-5 py-1.5 border border-[#19140035] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b] rounded-sm text-[#1b1b18] dark:text-[#EDEDEC] text-sm leading-normal"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block px-5 py-1.5 border border-transparent hover:border-[#19140035] dark:hover:border-[#3E3E3A] rounded-sm text-[#1b1b18] dark:text-[#EDEDEC] text-sm leading-normal"
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
                    {/* <div className="flex justify-between items-center mb-4 w-full">
                        <Search filters={filters} />
                    </div> */}
                    <PostsContent posts={posts} grid={1} />

                    <Pagination links={posts.links} />
                </Container>
            </div>
        </>
    );
}
