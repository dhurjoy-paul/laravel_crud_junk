import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { PencilLine, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function PostsTable({
    posts: allPosts,
}: {
    posts: PaginatedData<Post>;
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
            {/* bulk delete toolbar */}
            {selectedIds.length > 0 && (
                <div className="flex animate-in items-center justify-between rounded-lg border bg-muted/50 p-2 px-4 fade-in slide-in-from-top-1">
                    <span className="text-sm font-medium">
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

            {/* main table */}
            <div className="w-full rounded-md border">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[50px] text-center">
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            allPosts.data.length &&
                                        allPosts.data.length > 0
                                    }
                                    onCheckedChange={toggleSelectAll}
                                    className="cursor-pointer border-2 border-foreground"
                                />
                            </TableHead>
                            <TableHead className="font-semibold">
                                Title
                            </TableHead>
                            <TableHead className="hidden text-center font-semibold md:table-cell">
                                Status
                            </TableHead>
                            <TableHead className="hidden text-center font-semibold lg:table-cell">
                                Category
                            </TableHead>
                            <TableHead className="hidden text-center font-semibold lg:table-cell">
                                Content
                            </TableHead>
                            <TableHead className="text-center font-semibold">
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
                                    <TableCell className="text-center">
                                        <Checkbox
                                            className="cursor-pointer border-[1.5px] border-foreground"
                                            checked={selectedIds.includes(p.id)}
                                            onCheckedChange={() =>
                                                toggleSelectRow(p.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {p.title}
                                    </TableCell>
                                    <TableCell className="hidden text-center md:table-cell">
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
                                    <TableCell className="hidden text-center lg:table-cell">
                                        <Badge
                                            variant="outline"
                                            className="font-normal capitalize"
                                        >
                                            {p.category_name}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="hidden text-center lg:table-cell">
                                        <p>{p.content}</p>
                                    </TableCell>

                                    {/* actions */}
                                    <TableCell>
                                        <div className="flex justify-center gap-1.5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={posts.edit(p.id).url}
                                                >
                                                    {' '}
                                                    <PencilLine />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive-foreground hover:bg-destructive/50 hover:text-destructive-foreground"
                                                onClick={() =>
                                                    handleDelete(p.id)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    // should not be hardcoded
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
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
