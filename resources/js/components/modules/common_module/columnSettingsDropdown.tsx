import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, Filter, Settings2 } from 'lucide-react';
import { ModuleConfig } from './types';

interface ColumnSettingsDropdownProps {
    columnSettings: { key: string; visible: boolean }[];
    module: ModuleConfig;
    onToggle: (key: string) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
}

export function ColumnSettingsDropdown({
    columnSettings,
    module,
    onToggle,
    onMove,
}: ColumnSettingsDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    className="ml-auto flex gap-2 border"
                >
                    <Settings2 className="size-4" />
                    Customize Columns
                    <ChevronDown className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-60 bg-secondary p-2 text-secondary-foreground"
            >
                <div className="mb-1 border-b px-2 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Column Order & Visibility
                </div>
                <div className="max-h-[400px] overflow-y-auto pt-1 sm:max-h-fit">
                    {columnSettings.map((setting, index) => {
                        const field = module.fields.find(
                            (f) => f.key === setting.key,
                        );
                        if (!field) return null;
                        return (
                            <div
                                key={field.key}
                                className="group flex items-center rounded-md pr-2 transition-colors hover:bg-background"
                            >
                                <DropdownMenuCheckboxItem
                                    className={`flex-1 cursor-pointer border-none capitalize focus:bg-transparent ${setting.visible ? '' : 'opacity-60'}`}
                                    checked={setting.visible}
                                    onCheckedChange={() => onToggle(field.key)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {field.name}
                                    {field.options && (
                                        <Filter className="text-foreground/50" />
                                    )}
                                </DropdownMenuCheckboxItem>

                                {/* move controls */}
                                <div className="flex flex-col font-bold text-foreground opacity-40 transition-opacity group-hover:opacity-100">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-6 hover:bg-primary/30 hover:text-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onMove(index, 'up');
                                        }}
                                        disabled={index === 0}
                                    >
                                        <ChevronUp className="size-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-6 hover:bg-primary/30 hover:text-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onMove(index, 'down');
                                        }}
                                        disabled={
                                            index === columnSettings.length - 1
                                        }
                                    >
                                        <ChevronDown className="size-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
