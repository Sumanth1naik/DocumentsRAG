import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse, HttpProgressEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ChatRequest,
  ChatResponse,
  QueryRequest,
  QueryResponse,
  UploadResponse,
  UploadProgress
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class RagApiService {
  private apiUrl = 'http://localhost:8000';
  private uploadProgress$ = new Subject<UploadProgress>();

  constructor(private http: HttpClient) {}

  /**
   * Upload a document file to the backend
   */
  uploadFile(file: File): Observable<UploadResponse | UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>(
      `${this.apiUrl}/upload`,
      formData,
      { reportProgress: true, observe: 'events', responseType: 'json' as const }
    ).pipe(
      filter(
        (event): event is HttpProgressEvent | HttpResponse<UploadResponse> =>
          event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response
      ),
      map((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total || 0,
            percentage: event.total ? Math.round((event.loaded / event.total) * 100) : 0
          };
          this.uploadProgress$.next(progress);
          return progress;
        }

        if (event instanceof HttpResponse) {
          return event.body as UploadResponse;
        }

        throw new Error('Unexpected upload event type');
      })
    );
  }

  /**
   * Get upload progress observable
   */
  getUploadProgress$(): Observable<UploadProgress> {
    return this.uploadProgress$.asObservable();
  }

  /**
   * Ask a question to the RAG system
   */
  askQuestion(question: string): Observable<QueryResponse> {
    const request: QueryRequest = { question };
    return this.http.post<QueryResponse>(`${this.apiUrl}/ask`, request);
  }

  /**
   * Chat with session management
   */
  chat(sessionId: string, question: string): Observable<ChatResponse> {
    const request: ChatRequest = { session_id: sessionId, question };
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request);
  }

  /**
   * Get the API URL (useful for debugging)
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Set a custom API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }
}
