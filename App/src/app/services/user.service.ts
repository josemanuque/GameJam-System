import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_IP } from '../environments/environment';
import { UserFindResponseI, UserPasswordChangeI, UserResponseI } from '../../interfaces/user.interface'; // Importing frontend interfaces
import { RoleListResponseI } from '../../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = API_IP;
  private userDataSubject: BehaviorSubject<UserResponseI> = new BehaviorSubject<UserResponseI>(null!);
  userData$: Observable<any> = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUserData();
  }

  fetchUserData(): void {
    console.log('Fetching user data');
    this.http.get<UserResponseI>(`${this.apiUrl}/me`).pipe(
      tap(data => this.userDataSubject.next(data))
    ).subscribe();
  }

  updateUserData(username: string, userData: any): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData).pipe(
      tap(updatedUserData => {
        console.log('Updating user data');
        this.userDataSubject.next(updatedUserData);
      })
    );
  }

  logout(): void {
    this.userDataSubject.next(null!);
  }

  /**
   * 
   * @deprecated Use observable userData$ instead
   */
  getUser(): Observable<UserResponseI> {
    return this.http.get<UserResponseI>(`${this.apiUrl}/me`);
  }

  getAllUsers(): Observable<UserResponseI[]> {
    return this.http.get<UserResponseI[]>(`${this.apiUrl}/user`);
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
   * @deprecated use updateUserData instead
   */
  updateUserByUsername(username: string, userData: any): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData);
  }

  /**
   * @deprecated use updateUserData instead
   */
  updateUser(username: string, userData: UserResponseI): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData);
  }

  updatePassword(userData: UserPasswordChangeI): Observable<UserResponseI> {
    return this.http.post<UserResponseI>(`${this.apiUrl}/user/password/update`, userData);
  }

  getUserId(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/getUserId`, { params: { username: username } });
  }

  getAllValidRoles(): Observable<RoleListResponseI> {
    return this.http.get<RoleListResponseI>(`${this.apiUrl}/role`);
  }

  setRoles(username: string, roles: string[]): Observable<UserResponseI> {
    return this.http.patch<UserResponseI>(`${this.apiUrl}/role/set`, { username, roles });
  }
}
