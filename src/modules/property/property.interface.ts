import { PropertyStatus } from '../../../generated/prisma/client';

export type IPropertyInput = {
  title: string;
  description: string;
  location: string;
  price: number;
  status?: PropertyStatus;
  images?: string[];
  amenities?: string[];
  categoryId: string;
};

export type IPropertyFilterQuery = {
  searchTerm?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  amenities?: string;
};