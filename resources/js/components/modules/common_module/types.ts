export interface ModuleConfig {
    module_name: string; // Posts
    route_name: string; // '/posts'  // also have to make a method like /posts/bulk
    model_name: string; // Post
    filter_name?: string;
    actions?: boolean;
    fields: ModuleField[];
}

export type ModuleField = SortableField | NonSortableField;

interface BaseField {
    name: string;
    key: string;
    show_key?: string; // use when value will save as 'key' but need to show another column
    options?: any[];
    css_style?: string;
    custom_style?: 'badge' | 'truncate';
    align?: 'center' | 'left' | 'right';
    required?: boolean;
    form_sn?: number;
    table_hide?: boolean;
    form_hide?: boolean;
}

type OtherTypes =
    | 'tinymce'
    | 'textarea'
    | 'checkbox'
    | 'file'
    | 'text'
    | 'email'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'tel';

interface SortableField extends BaseField {
    input_type?: OtherTypes;
    sort?: boolean;
    option_value?: null;
}

interface NonSortableField extends BaseField {
    input_type?: 'select';
    sort?: false;
    option_value: 'name' | 'title' | string;
}

// each category, each genre
export interface FilterItem {
    id: number;
    name: string;
}

export interface PaginationLink {
    url: string | null;
    page: string | null;
    label: string;
    active: boolean;
}

// coming from BaseResourceController's index()
export interface PaginatedData<T> {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    path: string;
    links: PaginationLink[];
    first_page_url: string | null;
    last_page_url: string | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    data: T[];
}

export interface PaginationProps {
    filters: any;
    meta: {
        current_page: number;
        last_page: number;
        first_page_url: string | null;
        last_page_url: string | null;
        prev_page_url: string | null;
        next_page_url: string | null;
        from: number;
        to: number;
        total: number;
        per_page: number;
        path: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}
