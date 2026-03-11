import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAll(category?: string, search?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<Product[]>(this.API, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API}/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.API, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
