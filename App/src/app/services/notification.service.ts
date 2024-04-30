import { Injectable } from '@angular/core';
import { NotificationResponseI, NotificationRequestI } from '../../interfaces/notification.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { TeamAddKickRequestI, TeamMessageResponseI } from '../../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotifications(username: string): Observable<NotificationResponseI[]> {
    return this.http.get<NotificationResponseI[]>(`${API_IP}/notification/${username}`);
  }

  deleteNotification(id: string): Observable<NotificationResponseI> {
    return this.http.delete<NotificationResponseI>(`${API_IP}/notification/${id}`);
  }

  sendNotification(notification: NotificationRequestI): Observable<NotificationResponseI> {
    return this.http.post<NotificationResponseI>(`${API_IP}/notification`, notification);
  }
}
