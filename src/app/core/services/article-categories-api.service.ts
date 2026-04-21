import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import {
  AdminArticleCategory,
  ArticleCategory,
  ArticleCategoryPayload,
} from '../models/article-category.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleCategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/article-categories`;

  getPublicCategories(): Observable<ArticleCategory[]> {
    return this.http.get<ArticleCategory[]>(this.url);
  }

  getAdminCategories(): Observable<AdminArticleCategory[]> {
    return this.http.get<AdminArticleCategory[]>(`${this.url}/admin`);
  }

  createCategory(payload: ArticleCategoryPayload): Observable<AdminArticleCategory> {
    return this.http.post<AdminArticleCategory>(this.url, payload);
  }

  updateCategory(
    id: number,
    payload: ArticleCategoryPayload,
  ): Observable<AdminArticleCategory> {
    return this.http.put<AdminArticleCategory>(`${this.url}/${id}`, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

