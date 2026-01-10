export interface ModuleField {
    name: string; // table header & form labels
    key: string; // this is DB column name ('published_at', 'title')
    input_type:
        | 'textarea'
        | 'select'
        | 'file'
        | 'text'
        | 'email'
        | 'number'
        | 'date'
        | 'tel';
    options?: any[]; // this is for category / genre
    css_style?: string; // custom CSS classes
    custom_style?: string | 'badge'; // custom name style
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
    fields: ModuleField[];
}

// each category, each genre
export interface FilterItem {
    id: number;
    name: string;
}
