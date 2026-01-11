export interface ModuleField {
    name: string; // table header & form labels
    key: string; // this is DB column name ('published_at', 'title')
    input_type:
        | 'tinymce'
        | 'textarea'
        | 'select'
        | 'manualSelect'
        | 'checkbox'
        | 'file'
        | 'text'
        | 'email'
        | 'number'
        | 'date'
        | 'tel';
    options?: any[]; // this is for category / genre
    css_style?: string; // custom CSS classes
    custom_style?: 'badge' | 'truncate'; // custom name style
    form_sn?: number; // form input serial no
    table_hide?: boolean; // hide from table
    form_hide?: boolean; // hide from form
    sort?: boolean; // true, if want sorting on column
}

export interface ModuleConfig {
    module_name: string; // Posts
    route_name: string; // '/posts'  // also have to make a method like /posts/bulk
    model_name: string; // Post
    filter_name?: string;
    actions?: boolean;
    fields: ModuleField[];
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
