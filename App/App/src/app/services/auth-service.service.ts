import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Auth } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl: string = 'http://localhost:3000';  // URL to web api

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Auth | null> {
    const url = `${this.apiUrl}/auth/${email}/${password}`;

    return this.http.get<Auth>(url).pipe(
      catchError(() => of(null))
    );
  }
}
