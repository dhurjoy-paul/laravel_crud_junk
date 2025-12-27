import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
    create_post,
}: {
    breadcrumbs?: BreadcrumbItemType[];
    create_post?: boolean;
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                {create_post && (
                    <button
                        type="button"
                        className="border-default-medium text-body focus:outline-pointer-none: ml-auto box-border inline-flex w-auto items-center rounded-md border bg-primary px-2 py-1.5 text-sm leading-5 font-semibold text-primary-foreground shadow-xs transition-all duration-200 hover:bg-primary-foreground hover:text-primary"
                    >
                        Create post
                    </button>
                )}
            </div>
        </header>
    );
}
