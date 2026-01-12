import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, X } from 'lucide-react';
import { ModuleField } from './types';

interface DataTableCellProps {
    field: ModuleField;
    row: any;
}

export function DataTableCell({ field, row }: DataTableCellProps) {
    const value = row[field.key];

    // checkbox (boolean value)
    if (field.input_type === 'checkbox' || typeof value === 'boolean') {
        return (
            <div className="flex justify-center opacity-90">
                {Number(value) === 1 || value === true ? (
                    <Badge className="gap-1 bg-green-50 dark:bg-green-700 border-green-400 rounded-full text-green-900 dark:text-green-50">
                        <Check size={12} strokeWidth={5} />
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="gap-1 bg-red-50 dark:bg-red-700 border-red-400 rounded-full text-red-900 dark:text-red-50"
                    >
                        <X size={12} strokeWidth={5} />
                    </Badge>
                )}
            </div>
        );
    }

    // single image
    if (field.key === 'image_url' || field.key === 'image') {
        return value ? (
            <img
                src={`/storage/${value}`}
                className="mx-auto rounded size-10 object-cover"
                alt="thumbnail"
            />
        ) : (
            <span className="text-muted-foreground text-xs">No Image</span>
        );
    }

    // truncated with tooltip
    if (field.custom_style === 'truncate') {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                        <span
                            className={`mx-auto block max-w-[250px] cursor-help truncate ${field.css_style || ''}`}
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

    // default
    return <span className={field.css_style}>{value ?? '-'}</span>;
}
