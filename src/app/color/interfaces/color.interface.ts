export interface ColorResponse {
    data:  Color[];
    total: number;
    page:  number;
    limit: number;
}

export interface Color {
    id:        number;
    name:      string;
    isActive:  boolean;
    createdAt: Date;
}
