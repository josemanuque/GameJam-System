import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { GameRequestI, GameResponseI, GameMessageResponseI } from '../../interfaces/game.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  submitGame(gameData: GameRequestI): Observable<GameMessageResponseI> {
    return this.http.post<GameMessageResponseI>(`${this.apiUrl}/game`, gameData);
  }
}
