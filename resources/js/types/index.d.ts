import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    slug: string;
    title: string;
    author?: string | null;
    isbn?: string | null;
    description?: string | null;
    price?: number | null;
    quantity: number;
    image?: string | null;
    published_date?: string | Date | null;
    genre_id?: number | null;
    genre_name?: number | null;
    created_at?: string | Date;
    updated_at?: string | Date;
}

interface Post {
    id: number;
    slug: string;

    image: string;
    title: string;
    content: string;
    category_id: number;
    category_name: string;
    user_id: number;

    published_at: string;
}

interface PaginationLink {
    url: string | null;
    page: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    path: string;
    links: PaginationLink[];
    first_page_url: string | null;
    last_page_url: string | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    data: T[];
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username?: string;
    image: string;
    bio: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
