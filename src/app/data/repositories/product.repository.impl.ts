import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IProductRepository } from '../../domain/repositories/i-product.repository';
import { Product } from '../../domain/models/product.model';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({
  providedIn: 'root'
})
export class ProductRepositoryImpl implements IProductRepository {
  private http = inject(HttpClient);
  
  getProducts(): Observable<Product[]> {
    return this.http.get<{products: any[]}>('assets/data.json').pipe(
      map(data => data.products.map(p => ProductMapper.fromJson(p)))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
