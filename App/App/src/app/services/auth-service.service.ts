import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Auth } from '../../interfaces/auth.interface';
import { API_IP } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Auth | null> {
    const url = `${API_IP}/auth/login`;
    
    const credentials = { email, password };
    return this.http.post<Auth>(url, credentials).pipe(
      catchError(() => of(null))
    );
  }
}
