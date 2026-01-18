import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, Filter, GripVertical, Settings2 } from 'lucide-react';
import { ModuleConfig } from './types';

interface ColumnSettingsDropdownProps {
    columnSettings: { key: string; visible: boolean }[];
    module: ModuleConfig;
    onToggle: (key: string) => void;
    onReorder: (newOrder: { key: string; visible: boolean }[]) => void;
}

function SortableColumnItem({
    setting,
    field,
    onToggle,
}: {
    setting: any;
    field: any;
    onToggle: (key: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(setting.key) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center rounded-md pr-2 transition-colors hover:bg-background ${
                isDragging ? 'relative z-50 opacity-50 ring-2 ring-primary' : ''
            }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab p-2 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
                <GripVertical className="size-4" />
            </div>

            <DropdownMenuCheckboxItem
                className={`flex flex-1 cursor-pointer items-center justify-between border-none capitalize focus:bg-transparent ${
                    setting.visible ? '' : 'opacity-60'
                }`}
                checked={setting.visible}
                onCheckedChange={() => onToggle(field.key)}
                onSelect={(e) => e.preventDefault()}
            >
                <div className="flex items-center gap-1">
                    {field.name}
                    {field.options && (
                        <Filter className="size-3 text-foreground/50" />
                    )}
                </div>
                {field.key.includes('.') && (
                    <span className="text-[8px] font-medium text-blue-500 uppercase">
                        {field.key.split('.')[0]}
                    </span>
                )}
            </DropdownMenuCheckboxItem>
        </div>
    );
}

export function ColumnSettingsDropdown({
    columnSettings,
    module,
    onToggle,
    onReorder,
}: ColumnSettingsDropdownProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = columnSettings.findIndex(
                (s) => String(s.key) === String(active.id),
            );
            const newIndex = columnSettings.findIndex(
                (s) => String(s.key) === String(over.id),
            );
            onReorder(arrayMove(columnSettings, oldIndex, newIndex));
        }
    };

    return (
        <DropdownMenu modal={false}>
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
                className="w-72 bg-secondary p-2 text-secondary-foreground"
            >
                <div className="mb-1 border-b px-2 py-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Drag to Reorder & Toggle
                </div>

                <div className="scrollbar-thin scrollbar-thumb-muted-foreground/20 max-h-[400px] overflow-x-hidden overflow-y-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={columnSettings.map((s) => String(s.key))}
                            strategy={verticalListSortingStrategy}
                        >
                            {columnSettings.map((setting) => {
                                const field = module.fields.find(
                                    (f) => f.key === setting.key,
                                );
                                if (!field) return null;
                                return (
                                    <SortableColumnItem
                                        key={String(setting.key)}
                                        setting={setting}
                                        field={field}
                                        onToggle={onToggle}
                                    />
                                );
                            })}
                        </SortableContext>
                    </DndContext>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
