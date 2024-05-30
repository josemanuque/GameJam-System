import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { JamRequestI, JamResponseI, JamListResponseI, JamSiteAssignRequestI, JamMessageResponseI } from '../../interfaces/jam.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class JamService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  createJam(jamData: JamRequestI): Observable<JamResponseI> {
    return this.http.post<JamResponseI>(`${this.apiUrl}/jam`, jamData);
  }

  removeJam(jamId: string): Observable<JamMessageResponseI> {
    return this.http.delete<JamMessageResponseI>(`${this.apiUrl}/jam/${jamId}`);
  }

  removeSiteFromJam(jamId: string, siteId: string): Observable<JamMessageResponseI> {
    return this.http.delete<JamMessageResponseI>(`${this.apiUrl}/jam/site`, { params: { jamID: jamId, siteID: siteId } });
  }

  addSiteToJam(jamId: string, siteId: string): Observable<JamMessageResponseI> {
    return this.http.patch<JamMessageResponseI>(`${this.apiUrl}/jam/site`, { jamID: jamId, siteID: siteId });
  }

  addStageToJam(jamId: string, stageId: string): Observable<JamMessageResponseI> {
    return this.http.patch<JamMessageResponseI>(`${this.apiUrl}/jam/stage`, { jamID: jamId, stageID: stageId });
  }

  getJams(): Observable<JamListResponseI> {
    return this.http.get<JamListResponseI>(`${this.apiUrl}/jam`);
  }

  getJam(jamId: string): Observable<JamResponseI> {
    return this.http.get<JamResponseI>(`${this.apiUrl}/jam/${jamId}`);
  }

  updateJam(jamId: string, jamData: any): Observable<any> { 
    return this.http.put<any>(`${this.apiUrl}/jam/${jamId}`, jamData);
  }

  removeStageFromJam(jamId: string, stageId: string): Observable<JamMessageResponseI> {
    return this.http.delete<JamMessageResponseI>(`${this.apiUrl}/jam/${jamId}/stage/${stageId}`);
  }

  updateStagePriority(jamId: string, stages: string[]): Observable<JamMessageResponseI> {
    return this.http.patch<JamMessageResponseI>(`${this.apiUrl}/jam/stage/priority`, { jamID: jamId, stages });
  }
}
