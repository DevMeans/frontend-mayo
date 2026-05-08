export interface SizeResponse {
    data:  Size[];
    total: number;
    page:  number;
    limit: number;
}

export interface Size {
    id:        number;
    name:      string;
    isActive:  boolean;
    createdAt: Date;
}
