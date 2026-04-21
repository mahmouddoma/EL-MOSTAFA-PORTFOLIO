import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import { AdminStat, PublicStat, StatPayload } from '../models/stat.model';

@Injectable({
  providedIn: 'root',
})
export class StatsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/stats`;

  getPublicStats(): Observable<PublicStat[]> {
    return this.http.get<PublicStat[]>(this.url);
  }

  getAdminStats(): Observable<AdminStat[]> {
    return this.http.get<AdminStat[]>(`${this.url}/admin`);
  }

  createStat(payload: StatPayload): Observable<AdminStat> {
    return this.http.post<AdminStat>(this.url, payload);
  }

  deleteStat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

