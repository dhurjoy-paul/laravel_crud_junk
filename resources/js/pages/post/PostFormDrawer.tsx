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
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Category, Post } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function PostFormDrawer({
    open,
    onOpenChange,
    post,
    categories,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post?: Post | null;
    categories: Category[];
}) {
    const {
        data,
        setData,
        post: submitPost,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        title: '',
        content: '',
        category_id: '',
        image: null as File | null,
        _method: post ? 'PUT' : 'POST',
    });

    useEffect(() => {
        if (post) {
            setData({
                title: post.title,
                content: post.content,
                category_id: post.category_id.toString(),
                image: null,
                _method: 'PUT',
            });
        } else {
            reset();
        }
        clearErrors();
    }, [post, open]);

    const handleFileChange = (e: any) => {
        setData('image', e.target.files?.[0] || null);

        const file = e.target.files[0];
        if (file && file.size > 2048 * 1024) {
            alert('File is too big! Max 2MB.');
            e.target.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = post ? `/posts/${post.id}` : '/posts';
        submitPost(url, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
                {/* Header: Clean & Weighted */}
                <SheetHeader className="p-6 text-left">
                    <SheetTitle className="text-xl font-bold">
                        {post ? 'Edit Post' : 'New Post'}
                    </SheetTitle>
                    <SheetDescription>
                        {post
                            ? 'Update existing content.'
                            : 'Fill out the form to create a new post.'}
                    </SheetDescription>
                </SheetHeader>

                <Separator />

                {/* Form Body: Consistent Spacing */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <form
                        id="drawer-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Title
                            </Label>
                            <Input
                                required
                                id="title"
                                placeholder="Enter post title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="category"
                                className="text-sm font-medium"
                            >
                                Category
                            </Label>
                            <Select
                                value={data.category_id}
                                onValueChange={(val) =>
                                    setData('category_id', val)
                                }
                                required
                            >
                                <SelectTrigger id="category" className="w-full">
                                    <SelectValue placeholder="Select Category" />
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

                        <div className="space-y-2">
                            <Label
                                htmlFor="content"
                                className="text-sm font-medium"
                            >
                                Content
                            </Label>
                            <Textarea
                                id="content"
                                className="min-h-[180px]"
                                placeholder="Write your content here..."
                                value={data.content}
                                onChange={(e) =>
                                    setData('content', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.content} />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="image"
                                className="text-sm font-medium"
                            >
                                Featured Image
                            </Label>
                            <Input
                                required={!post}
                                id="image"
                                type="file"
                                className="bg-muted/30 py-2 text-xs"
                                accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/gif"
                                onChange={handleFileChange}
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Optional: Update previous image.
                            </p>
                            <InputError message={errors.image} />
                        </div>
                    </form>
                </div>

                <Separator />

                {/* Footer: Locked to Bottom */}
                <SheetFooter className="bg-muted/10 p-6">
                    <div className="flex w-full items-center gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            form="drawer-form"
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="h-4 w-4" />
                                    <span>Saving...</span>
                                </div>
                            ) : post ? (
                                'Save Changes'
                            ) : (
                                'Create Post'
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
