import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_IP } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  // Create a theme
  createTheme(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/theme`, formData);
  }

  // Remove a theme
  removeTheme(themeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/theme/${themeId}`);
  }

  // Get all theme names
  getThemes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theme`);
  }

  // Get a theme by ID
  getTheme(themeId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/theme/${themeId}`);
  }

  // Update a theme
  updateTheme(formData: FormData, themeId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/theme/${themeId}`, formData);
  }
}
