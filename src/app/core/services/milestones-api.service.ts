import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import { AdminMilestone, Milestone, MilestonePayload } from '../models/milestone.model';

@Injectable({
  providedIn: 'root',
})
export class MilestonesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/milestones`;

  getPublicMilestones(): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(this.url);
  }

  getAdminMilestones(): Observable<AdminMilestone[]> {
    return this.http.get<AdminMilestone[]>(`${this.url}/admin`);
  }

  createMilestone(payload: MilestonePayload): Observable<AdminMilestone> {
    return this.http.post<AdminMilestone>(this.url, payload);
  }

  updateMilestone(id: number, payload: MilestonePayload): Observable<AdminMilestone> {
    return this.http.put<AdminMilestone>(`${this.url}/${id}`, payload);
  }

  deleteMilestone(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

