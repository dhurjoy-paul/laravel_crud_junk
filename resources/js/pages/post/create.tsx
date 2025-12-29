import AppLayout from '@/layouts/app-layout';
import post, { store } from '@/routes/post';
import { Category, type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create post',
        href: post.create().url,
    },
];

export default function create({ categories }: { categories: Category[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="mx-auto w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">
                                Create a post
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                Enter your post details below to create a post
                            </p>
                        </div>
                    </div>

                    <Form
                        {...store.post()}
                        // resetOnSuccess={['password', 'password_confirmation']}
                        // disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">
                                            Post Title
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            required
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
                                        <Label htmlFor="content">
                                            Post content
                                        </Label>
                                        <Textarea
                                            required
                                            tabIndex={2}
                                            autoComplete="content"
                                            name="content"
                                            placeholder="Enter post content"
                                            id="content"
                                        />
                                        <InputError message={errors.content} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="image">Image</Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            required
                                            tabIndex={3}
                                            autoComplete="image"
                                            name="image"
                                            placeholder="Image URL"
                                            className="dark:bg-input/30"
                                        />
                                        <InputError message={errors.image} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select name="category_id" required>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map(
                                                    ({ id, name }) => (
                                                        <SelectItem
                                                            key={id}
                                                            value={id.toString()}
                                                        >
                                                            {name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.category_id}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        tabIndex={4}
                                        data-test="create-post-button"
                                    >
                                        {processing && <Spinner />}
                                        Create post
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
