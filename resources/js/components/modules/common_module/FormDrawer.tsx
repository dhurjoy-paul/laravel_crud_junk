import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect } from 'react';
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
            <SheetContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="flex flex-col gap-0 p-0 sm:max-w-md overflow-y-auto"
            >
                <SheetHeader className="p-6 text-left">
                    <SheetTitle className="font-bold text-xl">
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
                            const isDatabaseSelect =
                                field.input_type === 'select';
                            const isManualSelect =
                                field.input_type === 'manualSelect';

                            const currentKey = isDatabaseSelect
                                ? foreignKey
                                : field.key;

                            return (
                                <div key={field.key} className="space-y-2">
                                    <Label
                                        htmlFor={field.key}
                                        className="font-medium text-sm"
                                    >
                                        {field.name}
                                    </Label>

                                    {isDatabaseSelect || isManualSelect ? (
                                        <Select
                                            value={data[currentKey]?.toString()}
                                            onValueChange={(val) =>
                                                handleValueChange(
                                                    currentKey,
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
                                    ) : field.input_type === 'tinymce' ? (
                                        <div className="bg-background border rounded-md overflow-hidden">
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
                                        <div className="flex flex-row items-center space-x-3 space-y-0 shadow-sm p-4 border rounded-md">
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
                                                    className="font-medium text-sm cursor-pointer"
                                                >
                                                    {field.name}
                                                </Label>
                                            </div>
                                        </div>
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

                <div className="bottom-0 z-10 fixed bg-background p-6 border-t w-full sm:max-w-md">
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
                                <Spinner className="w-4 h-4" />
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
