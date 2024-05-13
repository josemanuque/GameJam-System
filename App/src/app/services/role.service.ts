import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_IP } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  // Create a role
  createRole(roleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/role`, roleData);
  }

  // Get all roles
  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/role`);
  }

  // Get a role by ID
  getRole(roleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/role/${roleId}`);
  }

}
