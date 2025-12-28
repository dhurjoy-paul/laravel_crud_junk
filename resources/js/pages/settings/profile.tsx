import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" />
                    <div className="flex items-center gap-9">
                        <Avatar className="size-36">
                            <AvatarImage src={`/storage/${auth.user.image}`} />
                            <AvatarFallback>
                                {`${auth.user.name}'s avatar`}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                                <Label className="min-w-18">Name</Label>
                                <p className="flex-1 py-1 pr-50 pr-auto pl-3 border border-secondary rounded-md w-full">
                                    {auth.user.name}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Label className="min-w-18">Bio</Label>
                                <p className="flex-1 py-1 pr-50 pr-auto pl-3 border border-secondary rounded-md w-full">
                                    {auth.user.bio}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Label className="min-w-18">Email</Label>
                                <p className="flex-1 py-1 pr-50 pr-auto pl-3 border border-secondary rounded-md w-full">
                                    {auth.user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <hr className="my-12" />
                    <HeadingSmall
                        title="Edit profile information"
                        description="Update your profile details"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="gap-2 grid">
                                    <Label htmlFor="image">Profile Image</Label>
                                    <Input
                                        type="file"
                                        id="image"
                                        className="block mt-1 w-full"
                                        name="image"
                                        autoComplete="image"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.image}
                                    />
                                </div>

                                <div className="gap-2 grid">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        className="block mt-1 w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="gap-2 grid">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        className="block mt-1 w-full"
                                        defaultValue={auth.user.bio}
                                        name="bio"
                                        autoComplete="bio"
                                        placeholder="Profile bio"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="gap-2 grid">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="block mt-1 w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-muted-foreground text-sm">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground decoration-neutral-300 hover:decoration-current! dark:decoration-neutral-500 underline underline-offset-4 transition-colors duration-300 ease-out"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 font-medium text-green-600 text-sm">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-neutral-600 text-sm">
                                            Saved
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
