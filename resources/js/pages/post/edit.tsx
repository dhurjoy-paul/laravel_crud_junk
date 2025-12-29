import AppLayout from '@/layouts/app-layout';
import postRoute from '@/routes/post';
import { Category, Post, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react'; //

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface PostForm {
    title: string;
    content: string;
    category_id: string;
    image: File | null;
    _method: string;
}

export default function Edit({
    categories,
    post,
}: {
    categories: Category[];
    post: Post;
}) {
    const {
        data,
        setData,
        post: submit,
        processing,
        errors,
    } = useForm<PostForm>({
        title: post.title,
        content: post.content,
        category_id: post.category_id.toString(),
        image: null,
        _method: 'POST',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Update post', href: postRoute.edit(post.id).url },
    ];

    // 2. Handle the submission manually
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit(postRoute.update(post.id).url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Post" />
            <div className="mx-auto w-full max-w-sm">
                <div className="mt-8 mb-6 flex flex-col items-center gap-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-xl font-medium">Update post</h1>
                        <p className="text-center text-sm text-muted-foreground">
                            Manage your post details below
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6">
                        {/* Title Field */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Post Title</Label>
                            <Input
                                id="title"
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                autoFocus
                                tabIndex={1}
                                autoComplete="title"
                                name="title"
                                placeholder="Enter post title"
                                className="dark:bg-input/30"
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Post content</Label>
                            <Textarea
                                required
                                tabIndex={2}
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                autoComplete="content"
                                name="content"
                                placeholder="Enter post content"
                                id="content"
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">Image (Optional)</Label>
                            <Input
                                id="image"
                                type="file"
                                tabIndex={3}
                                autoComplete="image"
                                name="image"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] || null,
                                    )
                                }
                                placeholder="Image URL"
                                className="dark:bg-input/30"
                            />
                            <InputError message={errors.image} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                required
                                value={data.category_id}
                                onValueChange={(val) =>
                                    setData('category_id', val)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={cat.id.toString()}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            Update Post
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
