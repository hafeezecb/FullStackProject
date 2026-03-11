import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderRequest, Order } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.API, request);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API}/${id}`);
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API}/user/${userId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API);
  }

  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.API}/${id}/status`, { status });
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.put<Order>(`${this.API}/${id}/cancel`, {});
  }
}
