import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { ModuleField } from './types';

const resolveValue = (obj: any, path: string) => {
    if (!path || !obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function DataTableCell({
    field,
    row,
}: {
    field: ModuleField;
    row: any;
}) {
    const displayKey = field.show_key || field.key;
    const value = resolveValue(row, displayKey);

    // checkbox (boolean value)
    if (field.input_type === 'checkbox' || typeof value === 'boolean') {
        return (
            <div className="flex justify-center opacity-90">
                {Number(value) === 1 || value === true ? (
                    <Badge className="gap-1 rounded-full border-green-400 bg-green-50 text-green-900 dark:bg-green-700 dark:text-green-50">
                        <Check size={12} strokeWidth={5} />
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="gap-1 rounded-full border-red-400 bg-red-50 text-red-900 dark:bg-red-700 dark:text-red-50"
                    >
                        <X size={12} strokeWidth={5} />
                    </Badge>
                )}
            </div>
        );
    }

    // single image
    if (
        displayKey === 'image_url' ||
        displayKey === 'image' ||
        field.input_type === 'file'
    ) {
        return value ? (
            <img
                src={`/storage/${value}`}
                className="mx-auto size-10 rounded object-cover"
                alt="thumbnail"
            />
        ) : (
            <span className="text-xs text-muted-foreground">No Image</span>
        );
    }

    // truncated with tooltip
    if (field.custom_style === 'truncate') {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                        <span
                            className={cn(
                                'block max-w-[250px] cursor-help truncate',
                                field.css_style,
                                field.align === 'left'
                                    ? 'text-left'
                                    : 'mx-auto',
                            )}
                        >
                            {value}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs break-words">
                        <p>{value}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // badge
    if (field.custom_style === 'badge') {
        return (
            <Badge variant="outline" className={field.css_style}>
                {value}
            </Badge>
        );
    }

    // date and datetime formatting
    if (
        field.input_type === 'date' ||
        field.input_type === 'datetime-local' ||
        displayKey.includes('date') ||
        displayKey.includes('_at')
    ) {
        if (!value) return <span className="text-muted-foreground">-</span>;

        try {
            const dateObj = new Date(value);
            if (isNaN(dateObj.getTime())) return <span>{value}</span>;

            if (field.input_type === 'date') {
                return (
                    <span className={field.css_style}>
                        {dateObj.toISOString().split('T')[0]}
                    </span>
                );
            }

            return (
                <span className={`whitespace-nowrap ${field.css_style || ''}`}>
                    {new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(dateObj)}
                </span>
            );
        } catch (e) {
            return <span>{value}</span>;
        }
    }

    // default
    return <span className={field.css_style}>{value ?? '-'}</span>;
}
