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

  createCategory(categoryData: CategoryCreateRequestI): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/category`, categoryData);
  }

  getCategoriesName(): Observable<CategoryListResponseI> {
    return this.http.get<CategoryListResponseI>(`${this.apiUrl}/category`);
  }

  getCategory(categoryId: string): Observable<CategoryResponseI> {
    return this.http.get<CategoryResponseI>(`${this.apiUrl}/category/${categoryId}`);
  }

  updateCategory(categoryId: string, categoryData: CategoryCreateRequestI): Observable<CategoryResponseI> {
    return this.http.put<CategoryResponseI>(`${this.apiUrl}/category/${categoryId}`, categoryData);
  }
}
