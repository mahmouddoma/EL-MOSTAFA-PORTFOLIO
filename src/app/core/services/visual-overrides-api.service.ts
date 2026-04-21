import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_V1_BASE_URL } from '../config/api.config';
import { VisualOverride, VisualOverridePayload } from '../models/visual-override.model';

@Injectable({
  providedIn: 'root',
})
export class VisualOverridesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_V1_BASE_URL}/overrides`;

  getOverrides(): Observable<VisualOverride[]> {
    return this.http.get<VisualOverride[]>(this.url);
  }

  saveOverride(payload: VisualOverridePayload): Observable<VisualOverride> {
    return this.http.post<VisualOverride>(this.url, payload);
  }
}

