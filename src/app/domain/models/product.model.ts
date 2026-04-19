export enum ProductCategory {
  TROPICAL = 'tropical',
  STONE = 'stone',
  CITRUS = 'citrus',
  EXOTIC = 'exotic'
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  imageFilter?: string;
  origin: string[];
  varieties?: string[];
  description: string;
  category: ProductCategory;
}
