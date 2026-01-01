import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
} from 'lucide-react';

interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        first_page_url: string | null;
        last_page_url: string | null;
        from: number;
        to: number;
        total: number;
        per_page: number;
        path: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}

export default function Pagination({ meta }: PaginationProps) {
    const {
        from,
        to,
        total,
        per_page,
        links,
        first_page_url,
        last_page_url,
        current_page,
        last_page,
    } = meta;

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            meta.path,
            { per_page: e.target.value, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t px-2 py-4 sm:flex-row">
            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
                Showing &nbsp;
                <span className="font-medium text-foreground">{from ?? 0}</span>
                &nbsp;{' - '}&nbsp;
                <span className="font-medium text-foreground">{to ?? 0}</span>
                &nbsp;{' of '}&nbsp;
                <span className="font-medium text-foreground">{total}</span>
                &nbsp; results
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                {/* Rows Per Page */}
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium whitespace-nowrap">
                        Rows per page
                    </p>
                    <select
                        value={per_page}
                        onChange={handlePerPageChange}
                        className="flex h-8 w-[70px] cursor-pointer rounded-md border border-input bg-transparent px-2 py-1 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                        {[5, 10, 15, 20, 50, 100].map((size) => (
                            <option
                                key={size}
                                value={size}
                                className="bg-background text-foreground"
                            >
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Navigation Controls */}
                <nav className="flex items-center space-x-1">
                    {/* First Page Button */}
                    <Link
                        href={first_page_url || '#'}
                        preserveScroll
                        className={`hidden h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground lg:flex ${current_page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Link>

                    {links.map((link, i) => {
                        const isPrev = link.label.includes('Previous');
                        const isNext = link.label.includes('Next');
                        const isEllipsis = link.label === '...';

                        let content: React.ReactNode = (
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );

                        if (isPrev)
                            content = <ChevronLeft className="h-4 w-4" />;
                        if (isNext)
                            content = <ChevronRight className="h-4 w-4" />;
                        if (isEllipsis)
                            content = <MoreHorizontal className="h-4 w-4" />;

                        return (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                preserveScroll
                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'pointer-events-none border-primary bg-primary text-primary-foreground'
                                        : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                } ${!link.url || isEllipsis ? 'pointer-events-none opacity-50' : ''} ${isPrev || isNext ? 'px-2' : ''} `}
                            >
                                {content}
                            </Link>
                        );
                    })}

                    {/* Last Page Button */}
                    <Link
                        href={last_page_url || '#'}
                        preserveScroll
                        className={`hidden h-8 w-8 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground lg:flex ${current_page === last_page ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Link>
                </nav>
            </div>
        </div>
    );
}
