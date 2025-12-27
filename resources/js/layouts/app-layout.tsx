import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    create_post?: boolean;
}

export default ({
    children,
    create_post,
    breadcrumbs,
    ...props
}: AppLayoutProps) => (
    <AppLayoutTemplate
        breadcrumbs={breadcrumbs}
        create_post={create_post}
        {...props}
    >
        {children}
    </AppLayoutTemplate>
);
