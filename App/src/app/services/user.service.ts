import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { UserResponseI } from '../../interfaces/user.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  getUsersFromPrefix(query: string): Observable<UserResponseI[]> {
    return this.http.get<UserResponseI[]>(`${this.apiUrl}/user/query/${query}`);
  }

  getUserByUsername(username: string): Observable<UserResponseI> {
    return this.http.get<UserResponseI>(`${this.apiUrl}/user/${username}`);
  }

  getUserById(id: string): Observable<UserResponseI> {
    return this.http.get<UserResponseI>(`${this.apiUrl}/user/id/${id}`);
  }

  updateUser(username: string, userData: any): Observable<UserResponseI> {
    return this.http.put<UserResponseI>(`${this.apiUrl}/user/${username}`, userData);
  }

  getUserId(username: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/user/getUserId`, { params: { username: username } });
  }
}
