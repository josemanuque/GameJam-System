import { Injectable } from '@angular/core';
import { NotificationIResponse } from '../../interfaces/notification.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { TeamAddKickRequestI, TeamMessageResponseI } from '../../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(username: string): Observable<NotificationIResponse[]> {
    return this.http.get<NotificationIResponse[]>(`${API_IP}/notification/${username}`);
  }

  deleteNotification(id: string): Observable<NotificationIResponse> {
    return this.http.delete<NotificationIResponse>(`${API_IP}/notification/${id}`);
  }
}
