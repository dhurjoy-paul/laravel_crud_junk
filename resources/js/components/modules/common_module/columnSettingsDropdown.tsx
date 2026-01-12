import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
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
                    className="flex gap-2 ml-auto border h-8"
                >
                    <Settings2 className="size-4" />
                    Customize Columns
                    <ChevronDown className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-secondary p-2 w-60 text-secondary-foreground"
            >
                <div className="mb-1 px-2 py-2 border-b font-bold text-muted-foreground text-xs uppercase tracking-wider">
                    Column Order & Visibility
                </div>
                <div className="pt-1 max-h-[400px] sm:max-h-fit overflow-y-auto">
                    {columnSettings.map((setting, index) => {
                        const field = module.fields.find(
                            (f) => f.key === setting.key,
                        );
                        if (!field) return null;
                        return (
                            <div
                                key={field.key}
                                className="group flex items-center hover:bg-background pr-2 rounded-md transition-colors"
                            >
                                <DropdownMenuCheckboxItem
                                    className={`flex-1 cursor-pointer border-none capitalize focus:bg-transparent ${setting.visible ? '' : 'opacity-60'}`}
                                    checked={setting.visible}
                                    onCheckedChange={() => onToggle(field.key)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {field.name}
                                </DropdownMenuCheckboxItem>

                                {/* move controls */}
                                <div className="flex flex-col opacity-40 group-hover:opacity-100 font-bold text-foreground transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-primary/30 w-6 h-5 hover:text-primary"
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
                                        className="hover:bg-primary/30 w-6 h-5 hover:text-primary"
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
