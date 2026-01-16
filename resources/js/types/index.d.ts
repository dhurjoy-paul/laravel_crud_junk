import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Headphone {
    id: number;
    brand: string;
    model_name: string;
    slug: string; // For SEO-friendly URLs (e.g., /products/sony-wh-1000xm5)
    type: 'Over-Ear' | 'On-Ear' | 'In-Ear';
    connection_type: 'Wired' | 'Wireless' | 'Hybrid';
    color: string;
    has_microphone: boolean;
    is_noise_cancelling: boolean;
    price: number; // Selling price
    discount_price?: number; // Sale price
    stock_quantity: number; // How many are in the warehouse
    status: 'In Stock' | 'Out of Stock' | 'Pre-order';
    image_url: string;
    description: string;
    location_rack: string; // Which aisle/shelf in the shop
}

export interface BookLoan {
    id: number;
    student_id: number;
    book_id: number;
    loan_date: string | Date;
    due_date: string | Date;
    returned_date?: string | Date | null; // nullable until book is returned
    created_at?: string | Date;
    updated_at?: string | Date;

    student?: Student; // for inertia eager loading
    book?: Book; // for inertia eager loading
}

export interface Book {
    id: number;
    slug: string;
    title: string;
    image?: string | null;
    author?: string | null;
    isbn?: string | null;
    description?: string | null;
    price?: number | null;
    quantity: number;
    available_copies: number;
    genre: string;
    floor: string;
    section: string;
    rack: string;
    published_date?: string | Date | null;
    created_at?: string | Date;
    updated_at?: string | Date;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    image?: string | null;
    student_card_id?: string | number | null;
    is_active?: boolean;
    max_borrow_limit: number;
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

interface Category {
    id: number;
    name: string;
}

interface Genre {
    id: number;
    name: string;
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
