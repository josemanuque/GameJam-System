import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_IP } from '../environments/environment';
import { CategoryCreateRequestI, CategoryResponseI, CategoryListResponseI } from '../../interfaces/category.interface'; // Importing frontend interfaces

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = API_IP;

  constructor(private http: HttpClient) { }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/category`, categoryData);
  }

  getCategoriesName(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category`);
  }

  getCategory(categoryId: string): Observable<CategoryResponseI> {
    return this.http.get<CategoryResponseI>(`${this.apiUrl}/category/${categoryId}`);
  }

  updateCategory(categoryId: string, categoryData: CategoryCreateRequestI): Observable<CategoryResponseI> {
    return this.http.put<CategoryResponseI>(`${this.apiUrl}/category/${categoryId}`, categoryData);
  }
}
