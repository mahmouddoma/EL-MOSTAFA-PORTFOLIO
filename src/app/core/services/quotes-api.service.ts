import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT_URL } from '../config/api.config';
import {
  Quote,
  QuotePagedResponse,
  QuotePayload,
  QuoteQuery,
  QuoteStatusPayload,
} from '../models/quote.model';

@Injectable({
  providedIn: 'root',
})
export class QuotesApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ROOT_URL}/quotes`;

  submitQuote(payload: QuotePayload): Observable<Quote> {
    return this.http.put<Quote>(this.url, payload);
  }

  getQuotes(query: QuoteQuery = {}): Observable<QuotePagedResponse> {
    return this.http.get<QuotePagedResponse>(this.url, {
      params: this.toQueryParams(query),
    });
  }

  getQuoteById(id: number): Observable<Quote> {
    return this.http.get<Quote>(`${this.url}/${id}`);
  }

  updateStatus(id: number, payload: QuoteStatusPayload): Observable<Quote> {
    return this.http.patch<Quote>(`${this.url}/${id}/status`, payload);
  }

  exportCsv(query: QuoteQuery = {}): Observable<Blob> {
    return this.http.get(`${this.url}/export.csv`, {
      params: this.toQueryParams(query),
      responseType: 'blob',
    });
  }

  deleteQuote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  private toQueryParams(query: QuoteQuery): HttpParams {
    let params = new HttpParams();

    if (query.status !== undefined) {
      params = params.set('Status', String(query.status));
    }

    if (query.search) {
      params = params.set('Search', query.search);
    }

    if (query.from) {
      params = params.set('From', query.from);
    }

    if (query.to) {
      params = params.set('To', query.to);
    }

    if (query.page !== undefined) {
      params = params.set('Page', String(query.page));
    }

    if (query.pageSize !== undefined) {
      params = params.set('PageSize', String(query.pageSize));
    }

    return params;
  }
}

