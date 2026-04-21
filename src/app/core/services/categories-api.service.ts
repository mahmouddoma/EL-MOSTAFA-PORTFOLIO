import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import { AdminCategory, Category, CategoryPayload } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/categories`;

  getPublicCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  getPublicCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${slug}`);
  }

  getAdminCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(`${this.url}/admin`);
  }

  getAdminCategoryById(id: number): Observable<AdminCategory> {
    return this.http.get<AdminCategory>(`${this.url}/admin/${id}`);
  }

  createCategory(payload: CategoryPayload): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(this.url, payload);
  }

  updateCategory(id: number, payload: CategoryPayload): Observable<AdminCategory> {
    return this.http.put<AdminCategory>(`${this.url}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

