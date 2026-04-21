import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import { AdminStaticPage, StaticPage, StaticPagePayload } from '../models/static-page.model';

@Injectable({
  providedIn: 'root',
})
export class StaticPagesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/pages`;

  getPublicPageBySlug(slug: string): Observable<StaticPage> {
    return this.http.get<StaticPage>(`${this.url}/${slug}`);
  }

  getAdminPages(): Observable<AdminStaticPage[]> {
    return this.http.get<AdminStaticPage[]>(`${this.url}/admin`);
  }

  getAdminPageById(id: number): Observable<AdminStaticPage> {
    return this.http.get<AdminStaticPage>(`${this.url}/admin/${id}`);
  }

  createPage(payload: StaticPagePayload): Observable<AdminStaticPage> {
    return this.http.post<AdminStaticPage>(this.url, payload);
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

