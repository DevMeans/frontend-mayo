export interface CategoryResponse {
    data:  Category[];
    total: number;
    page:  number;
    limit: number;
}

export interface Category {
    id:        number;
    name:      string;
    isActive:  boolean;
    createdAt: Date;
}
