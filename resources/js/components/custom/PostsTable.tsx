import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Ensure you have this shadcn component
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import posts from '@/routes/posts';
import { PaginatedData, Post } from '@/types';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function PostsTable({
    posts: allPosts,
    actions = true,
}: {
    posts: PaginatedData<Post>;
    grid?: number;
    actions?: boolean;
}) {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const toggleSelectAll = () => {
        if (selectedIds.length === allPosts.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allPosts.data.map((p) => p.id));
        }
    };

    const toggleSelectRow = (id: string | number) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    const handleBulkDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete ${selectedIds.length} posts?`,
            )
        ) {
            router.delete('/posts/bulk', {
                data: { ids: selectedIds },
                onSuccess: () => {
                    setSelectedIds([]);
                    alert('Posts deleted!');
                },
            });
        }
    };

    const handleDelete = (postId: string | number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/posts/${postId}`, {
                onSuccess: () => alert('Post deleted!'),
            });
        }
    };

    return (
        <div className="space-y-4">
            {/* 2. Bulk Action Toolbar */}
            {selectedIds.length > 0 && (
                <div className="flex justify-between items-center bg-muted/50 slide-in-from-top-1 p-2 px-4 border rounded-lg animate-in fade-in">
                    <span className="font-medium text-sm">
                        {selectedIds.length} items selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleBulkDelete}
                        >
                            Delete Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedIds([])}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div className="border rounded-md w-full">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            {/* 3. Checkbox Header */}
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            allPosts.data.length &&
                                        allPosts.data.length > 0
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead className="font-semibold">
                                Title
                            </TableHead>
                            <TableHead className="hidden md:table-cell font-semibold text-center">
                                Status
                            </TableHead>
                            <TableHead className="hidden lg:table-cell font-semibold text-center">
                                Category
                            </TableHead>
                            <TableHead className="hidden lg:table-cell font-semibold text-center">
                                Content
                            </TableHead>
                            <TableHead className="font-semibold text-center">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {allPosts?.data.length > 0 ? (
                            allPosts.data.map((p) => (
                                <TableRow
                                    key={p.id}
                                    className={`transition-colors ${selectedIds.includes(p.id) ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                                >
                                    {/* 4. Checkbox Cell */}
                                    <TableCell className="text-center">
                                        <Checkbox
                                            checked={selectedIds.includes(p.id)}
                                            onCheckedChange={() =>
                                                toggleSelectRow(p.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {p.title}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-center">
                                        <Badge
                                            variant={
                                                p.published_at
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                        >
                                            {p.published_at
                                                ? 'Published'
                                                : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-center">
                                        <Badge
                                            variant="outline"
                                            className="font-normal capitalize"
                                        >
                                            {p.category_name}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="hidden lg:table-cell text-center">
                                        <p>{p.content}</p>
                                    </TableCell>
                                    {actions && (
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={
                                                            posts.edit(p.id).url
                                                        }
                                                    >
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:bg-destructive/50 text-destructive-foreground hover:text-destructive-foreground"
                                                    onClick={() =>
                                                        handleDelete(p.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-muted-foreground text-center"
                                >
                                    No posts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
