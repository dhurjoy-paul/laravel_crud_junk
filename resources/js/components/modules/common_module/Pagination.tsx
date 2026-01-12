import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, BadgeInfo, MoreHorizontal } from 'lucide-react';
import { PaginationProps } from './types';

export default function Pagination({ filters, meta }: PaginationProps) {
    const { from, to, total, per_page, links, prev_page_url, next_page_url } =
        meta;

    const handlePerPageChange = (value: string) => {
        router.get(
            meta.path,
            { ...filters, per_page: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const getOrdinal = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    const baseBtnStyles =
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 h-8 min-w-[32px] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

    const variantDefault =
        'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90';
    const variantSecondary =
        'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80';

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex sm:flex-row flex-col justify-between items-center gap-4 px-2 py-4 border-t">
                {/* results info */}
                <div className="text-muted-foreground text-sm">
                    {total > 0 ? (
                        <>
                            Showing &nbsp;
                            <span className="font-medium text-foreground">
                                {from === to ? (
                                    total === 1 ? (
                                        '1'
                                    ) : (
                                        <>
                                            {from}
                                            {getOrdinal(from)}
                                        </>
                                    )
                                ) : (
                                    <>
                                        {from} &nbsp;{'-'}&nbsp; {to}
                                    </>
                                )}
                            </span>
                            &nbsp;{' of '}&nbsp;
                            <span className="font-medium text-foreground">
                                {total}
                            </span>
                            &nbsp; results
                        </>
                    ) : (
                        'No results found'
                    )}
                </div>

                <div className="flex sm:flex-row flex-col items-center gap-4 sm:gap-6">
                    {/* rows per page dropdown */}
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-sm whitespace-nowrap">
                            Rows per page
                        </p>
                        <Select
                            value={per_page.toString()}
                            onValueChange={handlePerPageChange}
                        >
                            <SelectTrigger className="border-2 w-[70px] h-8">
                                <SelectValue placeholder={per_page} />
                            </SelectTrigger>
                            <SelectContent className="min-w-[70px]">
                                {[5, 10, 15, 20, 50, 100].map((size) => (
                                    <SelectItem
                                        key={size}
                                        value={size.toString()}
                                    >
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* custom vertical line separator */}
                    <div
                        className="hidden sm:block bg-muted-foreground w-px h-6 shrink-0"
                        aria-hidden="true"
                    />

                    {/* navigation */}
                    <nav className="flex items-center space-x-1">
                        {/* previous page button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={prev_page_url || '#'}
                                    preserveScroll
                                    className={cn(
                                        baseBtnStyles,
                                        variantSecondary,
                                        !prev_page_url &&
                                            'pointer-events-none opacity-50',
                                        'mr-2 border-none bg-transparent shadow-none',
                                    )}
                                >
                                    <ArrowLeft className="size-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="flex items-center gap-2"
                            >
                                <BadgeInfo size={14} />
                                <span>Previous page</span>
                            </TooltipContent>
                        </Tooltip>

                        {/* dynamic page buttons */}
                        {links.map((link, i) => {
                            if (
                                link.label.includes('Previous') ||
                                link.label.includes('Next')
                            )
                                return null;

                            const isEllipsis = link.label === '...';

                            return (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveScroll
                                    className={cn(
                                        baseBtnStyles,
                                        link.active
                                            ? variantDefault
                                            : variantSecondary,
                                        isEllipsis &&
                                            'pointer-events-none bg-transparent opacity-75',
                                    )}
                                >
                                    {isEllipsis ? (
                                        <MoreHorizontal className="size-4" />
                                    ) : (
                                        link.label
                                    )}
                                </Link>
                            );
                        })}

                        {/* next page button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={next_page_url || '#'}
                                    preserveScroll
                                    className={cn(
                                        baseBtnStyles,
                                        variantSecondary,
                                        !next_page_url &&
                                            'pointer-events-none opacity-50',
                                        'ml-1 border-none bg-transparent shadow-none',
                                    )}
                                >
                                    <ArrowRight className="size-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="top"
                                className="flex items-center gap-2"
                            >
                                <BadgeInfo size={14} />
                                <span>Next page</span>
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </div>
            </div>
        </TooltipProvider>
    );
}
