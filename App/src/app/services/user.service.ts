import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_IP } from '../environments/environment';
import { UserFindResponseI, UserPasswordChangeI, UserResponseI } from '../../interfaces/user.interface'; // Importing frontend interfaces
import { RoleListResponseI } from '../../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  setUser(user: UserResponseI | null): void {
    console.log('Setting user:', user);
    localStorage.setItem("USER", JSON.stringify(user));
  }

  getUser(): UserResponseI | null {
    return JSON.parse(localStorage.getItem("USER")!);
  }

  getUsersFromPrefix(query: string): Observable<UserFindResponseI[]> {
    return this.http.get<UserFindResponseI[]>(`${this.apiUrl}/user/query/${query}`);
  }

  getUserByUsername(username: string): Observable<UserResponseI> {
    return this.http.get<UserResponseI>(`${this.apiUrl}/user/${username}`);
  }

  getUserById(id: string): Observable<UserResponseI> {
    return this.http.get<UserResponseI>(`${this.apiUrl}/user/id/${id}`);
  }
  /**
   * @deprecated
   */
  updateUserByUsername(username: string, userData: any): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData).pipe(
      tap((res: UserResponseI) => {
        this.setUser(res);
      })
    );
  }

  updateUser(username: string, userData: UserResponseI): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData).pipe(
      tap((res: UserResponseI) => {
        this.setUser(res);
      })
    );
  }

  updatePassword(userData: UserPasswordChangeI): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${userData.username}/password`, { userData });
  }

  getUserId(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/getUserId`, { params: { username: username } });
  }

  getAllValidRoles(): Observable<RoleListResponseI> {
    return this.http.get<RoleListResponseI>(`${this.apiUrl}/role`);
  }
}
