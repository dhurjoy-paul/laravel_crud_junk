import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { ModuleConfig } from './types';

export default function FormDrawer({
    module,
    open,
    onOpenChange,
    item,
    categories,
}: {
    module: ModuleConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any | null;
    categories: Category[];
}) {
    const form = useForm<Record<string, any>>({
        ...module.fields.reduce(
            (acc, field) => {
                acc[field.key] = item ? (item as any)[field.key] : '';
                return acc;
            },
            {} as Record<string, any>,
        ),
        category_id: item ? item.category_id.toString() : '',
        _method: item ? 'PUT' : 'POST',
    });

    const {
        data,
        setData,
        post: submitItem,
        processing,
        errors,
        reset,
        clearErrors,
    } = form;

    const handleSetData = (key: string, value: any) => {
        (setData as any)(key, value);
    };
    useEffect(() => {
        if (item) {
            const editData: any = { _method: 'PUT' };

            module.fields.forEach((field) => {
                if (field.input_type === 'file') {
                    editData[field.key] = null;
                } else {
                    editData[field.key] = (item as any)[field.key] || '';
                }
            });
            editData.category_id = item.category_id?.toString() || '';

            (setData as any)(editData);
        } else {
            (reset as any)();
        }
        (clearErrors as any)();
    }, [item, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = item
            ? `${module.route_name}/${item.id}`
            : module.route_name;
        submitItem(url, {
            forceFormData: true,
            onSuccess: () => {
                onOpenChange(false);
                (reset as any)();
            },
        });
    };

    const formFields = module.fields
        .filter((f) => !f.form_hide)
        .sort((a, b) => (a.form_sn || 0) - (b.form_sn || 0));

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
                <SheetHeader className="p-6 text-left">
                    <SheetTitle className="font-bold text-xl">
                        {item
                            ? `Edit ${module.model_name}`
                            : `New ${module.model_name}`}
                    </SheetTitle>
                    <SheetDescription>
                        {item
                            ? 'Update existing content.'
                            : `Fill out the form to create a new ${module.model_name.toLowerCase()}.`}
                    </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="flex-1 px-6 py-4 overflow-y-auto">
                    <form
                        id="drawer-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {formFields.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <Label
                                    htmlFor={field.key}
                                    className="font-medium text-sm"
                                >
                                    {field.name}
                                </Label>

                                {field.key === 'category_name' ||
                                field.key === 'category_id' ? (
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(val) =>
                                            handleSetData('category_id', val)
                                        }
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id.toString()}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : field.input_type === 'textarea' ? (
                                    <Textarea
                                        id={field.key}
                                        className="min-h-[120px]"
                                        value={data[field.key] || ''}
                                        onChange={(e) =>
                                            handleSetData(
                                                field.key,
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                ) : field.input_type === 'file' ? (
                                    <div className="space-y-2">
                                        <Input
                                            id={field.key}
                                            type="file"
                                            required={!item}
                                            className="bg-muted/30 py-2 text-xs"
                                            accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/gif"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0] || null;

                                                if (
                                                    file &&
                                                    file.size > 2048 * 1024
                                                ) {
                                                    alert(
                                                        'File is too big! Max 2MB.',
                                                    );
                                                    e.target.value = '';
                                                    handleSetData(
                                                        field.key,
                                                        null,
                                                    );
                                                    return;
                                                }

                                                handleSetData(field.key, file);
                                            }}
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            {item
                                                ? 'Optional: Leave empty to keep the current image.'
                                                : 'Max size 2MB. Format: JPG, PNG, SVG, or GIF.'}
                                        </p>
                                    </div>
                                ) : (
                                    <Input
                                        id={field.key}
                                        type={field.input_type}
                                        value={data[field.key] || ''}
                                        onChange={(e) =>
                                            handleSetData(
                                                field.key,
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                )}
                                <InputError
                                    message={(errors as any)[field.key]}
                                />
                            </div>
                        ))}
                    </form>
                </div>

                <Separator />

                <SheetFooter className="bg-muted/10 p-6">
                    <div className="flex items-center gap-3 w-full">
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            form="drawer-form"
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="w-4 h-4" />
                                    <span>Saving...</span>
                                </div>
                            ) : item ? (
                                'Save Changes'
                            ) : (
                                `Create ${module.model_name}`
                            )}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
