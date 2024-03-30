import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { AuthResponseI } from '../../interfaces/auth.response';
import { API_IP } from '../environments/environment';
import { UserLoginI } from '../../interfaces/auth.credentials';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string = '';

  constructor(private http: HttpClient) { 
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token !== '' && token !== null) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      if (expirationDate > new Date()) {
        this.token = token;
      } else {
        console.log('Token expired');
        // Log out logic
      }
    }
  }

  login(userCredentials: UserLoginI): Observable<AuthResponseI | null> {
    const url = `${API_IP}/auth/login`;
    
    return this.http.post<AuthResponseI>(url, userCredentials).pipe(tap(
      (res: AuthResponseI) => {
        if (res) {
          this.saveToken(res.accessToken, "");
        }
      }
    ));
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    this.token = token;
    //localStorage.setItem("EXPIRES_IN", expiresIn);
  }

  public getToken(): string {
    if (!this.token) {
      const storedToken = localStorage.getItem("ACCESS_TOKEN");
      if (storedToken !== null) {
        this.token = storedToken;
      }
      else {
        this.token = '';
      }
    }
    return this.token;
  }
}
