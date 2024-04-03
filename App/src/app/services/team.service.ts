import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { TeamCreateRequestI, TeamResponseI, TeamAddKickRequestI, TeamRenameRequestI, TeamMessageResponseI } from '../../interfaces/team.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  createTeam(teamData: TeamCreateRequestI): Observable<TeamResponseI> {
    return this.http.post<TeamResponseI>(`${this.apiUrl}/team`, teamData);
  }

  addMember(teamId: string, username: string): Observable<TeamMessageResponseI> {
    return this.http.patch<TeamMessageResponseI>(`${this.apiUrl}/team/add`, { teamID: teamId, username: username });
  }

  kickMember(teamId: string, username: string): Observable<TeamMessageResponseI> {
    return this.http.patch<TeamMessageResponseI>(`${this.apiUrl}/team/kick`, { teamID: teamId, username: username });
  }

  changeTeamName(teamId: string, newName: string): Observable<TeamMessageResponseI> {
    return this.http.put<TeamMessageResponseI>(`${this.apiUrl}/team/${teamId}`, { name: newName });
  }

  getUserTeam(username: string): Observable<TeamResponseI> {
    return this.http.get<TeamResponseI>(`${this.apiUrl}/team/user/${username}`);
  }

  getTeam(teamId: string): Observable<TeamResponseI> {
    return this.http.get<TeamResponseI>(`${this.apiUrl}/team/${teamId}`);
  }
}
