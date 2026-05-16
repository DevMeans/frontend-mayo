export interface ColorResponse {
    data:  Color[];
    total: number;
    page:  number;
    limit: number;
}

export interface Color {
    id:        number;
    name:      string;
    hex?:      string | null;
    isActive:  boolean;
    createdAt: Date;
}
