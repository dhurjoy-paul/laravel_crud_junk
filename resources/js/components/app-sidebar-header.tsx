import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import posts from '@/routes/posts';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';

export function AppSidebarHeader({
    breadcrumbs = [],
    create_post,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    create_post?: boolean;
}) {
    return (
        <header className="flex items-center gap-2 px-6 md:px-4 border-sidebar-border/50 border-b h-16 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 transition-[width,height] ease-linear shrink-0">
            <div className="flex items-center w-full">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                {create_post && (
                    <Link
                        href={posts.create().url}
                        type="button"
                        className="inline-flex box-border items-center bg-primary hover:bg-primary-foreground shadow-xs ml-auto px-2 py-1.5 border border-default-medium rounded-md focus:outline-pointer-none w-auto font-semibold text-body text-primary-foreground hover:text-primary text-sm leading-5 transition-all duration-200 cursor-pointer"
                    >
                        Create post
                    </Link>
                )}
            </div>
        </header>
    );
}
