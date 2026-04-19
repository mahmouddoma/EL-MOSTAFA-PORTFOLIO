import { Product, ProductCategory } from '../../domain/models/product.model';

export class ProductMapper {
  static fromJson(json: any): Product {
    return {
      id: json.id,
      name: json.name,
      origin: json.origin as string[],
      varieties: json.varieties as string[] | undefined,
      description: json.description,
      category: json.category as ProductCategory,
      imageUrl: json.imageUrl,
    };
  }
}
