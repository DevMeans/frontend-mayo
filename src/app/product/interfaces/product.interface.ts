import { Category } from '../../category/interfaces/category.interface';
import { Color } from '../../color/interfaces/color.interface';
import { Size } from '../../size/interfaces/size.interface';

export interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore?: boolean;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Pick<Category, 'id' | 'name'>;
  variantCount?: number;
  imageCount?: number;
  variants?: ProductVariant[];
  images?: Array<{ id: number; url: string }>;
}

export interface ProductVariant {
  colorId: number;
  sizeId: number;
  price: number;
  imageUrl?: string | null;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  categoryId: number;
  colorIds: number[];
  sizeIds: number[];
  imageUrls?: string[];
  imageFiles?: Array<{ filename: string; data: string }>;
  variants: Array<{
    colorId: number;
    sizeId: number;
    price: number;
    imageUrl?: string | null;
    imageFile?: { filename: string; data: string };
  }>;
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  categoryId?: number;
  isActive?: boolean;
  colorIds?: number[];
  sizeIds?: number[];
  imageUrls?: string[];
  imageFiles?: Array<{ filename: string; data: string }>;
  variants?: Array<{
    colorId: number;
    sizeId: number;
    price: number;
    imageUrl?: string | null;
    imageFile?: { filename: string; data: string };
  }>;
}

export interface GenerateVariantsRequest {
  colorIds: number[];
  sizeIds: number[];
}

export interface GenerateVariantsResponse {
  variants: Array<{
    colorId: number;
    sizeId: number;
  }>;
  count: number;
  message: string;
}
