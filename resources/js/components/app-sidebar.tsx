import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, home } from '@/routes';
import bookloans from '@/routes/bookloans';
import books from '@/routes/books';
import headphones from '@/routes/headphones';
import posts from '@/routes/posts';
import students from '@/routes/students';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpenText,
    FileText,
    GraduationCap,
    Headset,
    LayoutGrid,
    LibraryBig,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Students',
        href: students.index(),
        icon: GraduationCap,
    },
    {
        title: 'Books',
        href: books.index(),
        icon: BookOpenText,
    },
    {
        title: 'Book Loan',
        href: bookloans.index(),
        icon: LibraryBig,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Headphones',
        href: headphones.index(),
        icon: Headset,
    },
    {
        title: 'Posts',
        href: posts.index(),
        icon: FileText,
    },
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={home()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
