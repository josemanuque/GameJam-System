import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_IP } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = API_IP;
  constructor(private http: HttpClient) { }


  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/photo`, formData);
  }
}
