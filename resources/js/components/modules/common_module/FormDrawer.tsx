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
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { ModuleConfig } from './types';

export default function FormDrawer({
    module,
    open,
    onOpenChange,
    item,
}: {
    module: ModuleConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: any | null;
}) {
    const foreignKey = `${module.filter_name}_id`;

    const {
        data,
        setData,
        post: submitItem,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<Record<string, any>>({
        ...module.fields.reduce(
            (acc, field) => {
                acc[field.key] = '';
                return acc;
            },
            {} as Record<string, any>,
        ),
        [foreignKey]: '',
        _method: 'POST',
    });

    useEffect(() => {
        if (open) {
            if (item) {
                const editData: any = { _method: 'PUT' };
                module.fields.forEach((field) => {
                    if (field.input_type === 'file') {
                        editData[field.key] = null;
                    } else {
                        editData[field.key] = item[field.key] ?? '';
                    }
                });
                editData[foreignKey] = item[foreignKey]?.toString() ?? '';
                setData(editData);
            } else {
                reset();
            }
            clearErrors();
        }
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
                reset();
            },
        });
    };

    const handleValueChange = (key: string, value: any) => {
        (setData as any)(key, value);
    };

    const formFields = module.fields
        .filter((f) => !f.form_hide)
        .sort((a, b) => (a.form_sn || 0) - (b.form_sn || 0));

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-0 overflow-y-auto p-0 sm:max-w-md">
                <SheetHeader className="p-6 text-left">
                    <SheetTitle className="text-xl font-bold">
                        {item
                            ? `Edit ${module.model_name}`
                            : `New ${module.model_name}`}
                    </SheetTitle>
                    <SheetDescription>
                        Fill out the details below.
                    </SheetDescription>
                </SheetHeader>

                <Separator />

                <div className="flex-1 px-6 py-4">
                    <form
                        id="drawer-form"
                        onSubmit={handleSubmit}
                        className="space-y-5 pb-24"
                    >
                        {formFields.map((field) => {
                            const isSelectField = field.input_type === 'select';
                            const currentKey = isSelectField
                                ? foreignKey
                                : field.key;

                            return (
                                <div key={field.key} className="space-y-2">
                                    <Label
                                        htmlFor={field.key}
                                        className="text-sm font-medium"
                                    >
                                        {field.name}
                                    </Label>

                                    {field.input_type === 'select' ? (
                                        <Select
                                            value={data[foreignKey]}
                                            onValueChange={(val) =>
                                                handleValueChange(
                                                    foreignKey,
                                                    val,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id={field.key}
                                                className="w-full"
                                            >
                                                <SelectValue
                                                    placeholder={`Select ${field.name}`}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options?.map(
                                                    (opt: any) => (
                                                        <SelectItem
                                                            key={opt.id}
                                                            value={opt.id.toString()}
                                                        >
                                                            {opt.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    ) : field.input_type === 'textarea' ? (
                                        <Textarea
                                            id={field.key}
                                            value={data[field.key] || ''}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    ) : field.input_type === 'file' ? (
                                        <Input
                                            id={field.key}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/gif"
                                            onChange={(e) =>
                                                handleValueChange(
                                                    field.key,
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            required={!item}
                                        />
                                    ) : (
                                        <Input
                                            id={field.key}
                                            type={field.input_type}
                                            value={data[field.key] || ''}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    )}
                                    <InputError message={errors[currentKey]} />
                                </div>
                            );
                        })}
                    </form>
                </div>

                <div className="fixed bottom-0 z-10 w-full border-t bg-background p-6 sm:max-w-md">
                    <div className="flex w-full items-center gap-3">
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
                                <Spinner className="h-4 w-4" />
                            ) : item ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
