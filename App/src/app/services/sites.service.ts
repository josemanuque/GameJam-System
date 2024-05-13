import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { SiteCreateRequestI, SiteResponseI, SiteListResponseI, SiteMessageResponseI } from '../../interfaces/site.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  createSite(siteData: any): Observable<SiteCreateRequestI> {
    return this.http.post<any>(`${this.apiUrl}/site`, siteData);
  }

  removeSite(siteId: string): Observable<SiteMessageResponseI> {
    return this.http.delete<SiteMessageResponseI>(`${this.apiUrl}/site/${siteId}`);
  }

  getSitesFromCountry(country: string): Observable<SiteListResponseI> {
    return this.http.get<SiteListResponseI>(`${this.apiUrl}/site/country/${country}`);
  }

  getSitesFromRegion(region: string): Observable<SiteListResponseI> {
    return this.http.get<SiteListResponseI>(`${this.apiUrl}/site/region/${region}`);
  }

  getSites(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/site`);
  }

  getSite(siteId: string): Observable<SiteResponseI> {
    return this.http.get<SiteResponseI>(`${this.apiUrl}/site/${siteId}`);
  }
}
