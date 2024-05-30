import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { StageListI } from '../../interfaces/stage.interface';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  // Create a stage
  createStage(stageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stage`, stageData);
  }

  // Update a stage
  updateStage(stageId: string, stageData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stage/${stageId}`, stageData);
  }

  // Remove a stage
  removeStage(stageId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stage/${stageId}`);
  }

  // Get all stages
  getStages(): Observable<StageListI> {
    return this.http.get<StageListI>(`${this.apiUrl}/stage`);
  }

  // Get a stage by ID
  getStage(stageId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stage/${stageId}`);
  }

  // Get time remaining for stage
  getTimeRemaining(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/time`);
  }
}
