import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect } from 'react';
import ComboboxField from './ComboboxField';
import { ModuleConfig } from './types';

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

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
                acc[field.key] = field.input_type === 'checkbox' ? 0 : '';
                return acc;
            },
            {} as Record<string, any>,
        ),
        _method: 'POST',
    });

    useEffect(() => {
        if (open) {
            if (item) {
                const editData: any = {
                    _method: 'PUT',
                    id: item.id,
                };

                module.fields.forEach((field) => {
                    const rawValue = item[field.key];

                    if (field.input_type === 'file') {
                        editData[field.key] = null;
                    } else if (field.input_type === 'date' && rawValue) {
                        editData[field.key] = rawValue.split('T')[0];
                    } else if (
                        field.input_type === 'datetime-local' &&
                        rawValue
                    ) {
                        const date = new Date(rawValue);
                        const offset = date.getTimezoneOffset() * 60000;
                        editData[field.key] = new Date(date.getTime() - offset)
                            .toISOString()
                            .slice(0, 16);
                    } else {
                        editData[field.key] = rawValue?.toString() ?? '';
                    }
                });
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
            <SheetContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="flex flex-col gap-0 overflow-y-auto p-0 sm:max-w-md"
            >
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
                            return (
                                <div key={field.key} className="space-y-2">
                                    {field.input_type === 'checkbox' ? null : (
                                        <Label
                                            htmlFor={field.key}
                                            className="text-sm font-medium"
                                        >
                                            {field.name}
                                        </Label>
                                    )}

                                    {field.input_type === 'select' ? (
                                        <ComboboxField
                                            field={field}
                                            currentKey={field.key}
                                            currentValue={data[
                                                field.key
                                            ]?.toString()}
                                            onSelect={(val) =>
                                                handleValueChange(
                                                    field.key,
                                                    val,
                                                )
                                            }
                                        />
                                    ) : field.input_type === 'tinymce' ? (
                                        <div className="overflow-hidden rounded-md border bg-background">
                                            <Editor
                                                onFocusIn={(e) => {
                                                    e.stopImmediatePropagation();
                                                }}
                                                onEditorChange={(
                                                    newValue: string,
                                                ) =>
                                                    handleValueChange(
                                                        field.key,
                                                        newValue,
                                                    )
                                                }
                                                value={data[field.key] || ''}
                                                licenseKey="gpl"
                                                init={EditorInitOptions}
                                            />
                                        </div>
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
                                    ) : field.input_type === 'checkbox' ? (
                                        <div className="flex flex-row items-center gap-4 rounded-md border px-5 py-3 shadow-sm">
                                            <Checkbox
                                                id={field.key}
                                                checked={
                                                    data[field.key] === 1 ||
                                                    data[field.key] === true
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleValueChange(
                                                        field.key,
                                                        checked ? 1 : 0,
                                                    )
                                                }
                                            />
                                            <div className="space-y-1 leading-none">
                                                <Label
                                                    htmlFor={field.key}
                                                    className="cursor-pointer text-sm font-medium"
                                                >
                                                    {field.name}
                                                </Label>
                                            </div>
                                        </div>
                                    ) : (
                                        <Input
                                            id={field.key}
                                            type={field.input_type}
                                            value={data[field.key] ?? ''}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            step={
                                                field.input_type ===
                                                'datetime-local'
                                                    ? '1'
                                                    : undefined
                                            }
                                            required
                                        />
                                    )}
                                    <InputError message={errors[field.key]} />
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

const EditorInitOptions = {
    height: 400,
    menubar: true,
    base_url: '/tinymce',
    suffix: '.min',
    skin: isDarkMode ? 'oxide-dark' : 'oxide',
    content_css: isDarkMode ? 'dark' : 'default',
    branding: false,
    promotion: false,
    sticky_toolbar: true,
    toolbar:
        'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'preview',
        'help',
        'wordcount',
    ],
};
