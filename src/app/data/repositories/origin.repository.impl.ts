import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IOriginRepository } from '../../domain/repositories/i-origin.repository';
import { Origin } from '../../domain/models/origin.model';
import { OriginMapper } from '../mappers/origin.mapper';

@Injectable({
  providedIn: 'root'
})
export class OriginRepositoryImpl implements IOriginRepository {
  private http = inject(HttpClient);

  getOrigins(): Observable<Origin[]> {
    return this.http.get<{origins: any[]}>('/assets/data.json').pipe(
      map(data => data.origins.map(o => OriginMapper.fromJson(o)))
    );
  }
}
