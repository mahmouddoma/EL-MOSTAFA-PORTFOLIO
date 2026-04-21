import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import { AdminRegion, Region, RegionPayload } from '../models/region.model';

@Injectable({
  providedIn: 'root',
})
export class RegionsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/regions`;

  getPublicRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.url);
  }

  getAdminRegions(): Observable<AdminRegion[]> {
    return this.http.get<AdminRegion[]>(`${this.url}/admin`);
  }

  getAdminRegionById(id: number): Observable<AdminRegion> {
    return this.http.get<AdminRegion>(`${this.url}/admin/${id}`);
  }

  createRegion(payload: RegionPayload): Observable<AdminRegion> {
    return this.http.post<AdminRegion>(this.url, payload);
  }

  updateRegion(id: number, payload: RegionPayload): Observable<AdminRegion> {
    return this.http.put<AdminRegion>(`${this.url}/${id}`, payload);
  }

  deleteRegion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

