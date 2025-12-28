import { PaginatedData, Post } from '@/types';
import { Link } from '@inertiajs/react';

export default function PostsContent({
    posts,
    grid,
    actions,
}: {
    posts: PaginatedData<Post>;
    grid?: number;
    actions?: boolean;
}) {
    return (
        <div
            className={`grid gap-6 ${grid ? `md:grid-cols-${grid}` : 'grid-cols-1'}`}
        >
            {posts?.data.length > 0 ? (
                posts.data.map((post) => (
                    <div
                        key={post.id}
                        className="group relative flex md:flex-row flex-col bg-card shadow-sm hover:shadow-md border rounded-xl overflow-hidden text-card-foreground transition-all"
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-72 h-48 md:h-auto overflow-hidden">
                            <img
                                src={`/storage/${post.image}`}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col flex-1 p-5">
                            <div className="flex-1">
                                <Link href={post.slug}>
                                    <h3 className="mb-2 font-semibold text-xl decoration-primary hover:underline underline-offset-4 tracking-tight">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="mb-4 text-muted-foreground text-sm line-clamp-2">
                                    {post.content}
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-auto pt-4 border-border/50 border-t">
                                <Link
                                    href={post.slug}
                                    className="font-medium text-primary text-sm hover:underline"
                                >
                                    Read more ➺
                                </Link>

                                {actions && (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            // href={route('post.edit', post.id)}
                                            className="inline-flex justify-center items-center bg-secondary hover:bg-secondary/80 px-3 py-1.5 border rounded-md font-medium text-secondary-foreground text-xs transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center items-center bg-destructive/10 hover:bg-destructive px-3 py-1.5 rounded-md font-medium text-destructive-foreground hover:text-destructive-foreground text-xs transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-20 border-2 border-dashed rounded-xl text-center">
                    <p className="font-medium text-muted-foreground">
                        No posts found.
                    </p>
                </div>
            )}
        </div>
    );
}
