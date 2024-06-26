import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthForgotPasswordI, AuthResetPasswordI, AuthResponseI, UserRegisterI } from '../../interfaces/auth.interface';
import { API_IP } from '../environments/environment';
import { UserLoginI } from '../../interfaces/auth.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private http: HttpClient) {}

  login(userCredentials: UserLoginI): Observable<AuthResponseI> {
    return this.http.post<AuthResponseI>(`${API_IP}/auth/login`, userCredentials).pipe(
      tap((res: AuthResponseI) => {
        if (res){
          this.setToken(res.accessToken);
          this.userService.fetchUserData();
        }
      })
    );
  }

  register(userCredentials: any, byAdmin: boolean): Observable<any | null> {
    return this.http.post<any>(`${API_IP}/auth/register`, userCredentials).pipe(
      tap((res: any) => {
        if (res){
          if (!byAdmin){
            this.setToken(res.accessToken);
          }
        }
      })
    );
  }

  
  setToken(token: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
  }

  getToken(): string | null {
    return localStorage.getItem("ACCESS_TOKEN");
  }

  isAuthenticated(): Observable<AuthResponseI | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<AuthResponseI>(`${API_IP}/auth/verifyToken`, { headers });
  }

  logout(): void {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER");
  }

  isTokenExpired(token: string): boolean {
    const jwtHelper = new JwtHelperService();
    return jwtHelper.isTokenExpired(token);
  }

  sendPasswordResetEmail(authForgotPasswordI: AuthForgotPasswordI): Observable<any> {
    return this.http.post(`${API_IP}/auth/forgotPassword`, authForgotPasswordI);
  }

  resetPassword(authResetPasswordI: AuthResetPasswordI): Observable<any> {
    return this.http.post(`${API_IP}/auth/resetPassword`, authResetPasswordI);
  }
}
