export type StoreType = 'STORE' | 'WAREHOUSE';

export interface Store {
  id: number;
  name: string;
  code: string;
  type: StoreType;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
