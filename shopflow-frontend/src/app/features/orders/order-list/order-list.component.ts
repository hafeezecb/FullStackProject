import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/models';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>My Orders</h1>
    <div class="loading" *ngIf="loading">Loading orders...</div>

    <div class="empty-state" *ngIf="!loading && orders.length === 0">
      <p>You haven't placed any orders yet.</p>
      <a routerLink="/products" class="btn-shop">Start Shopping</a>
    </div>

    <div class="orders-list" *ngIf="!loading && orders.length > 0">
      <div class="order-card" *ngFor="let order of orders">
        <div class="order-header">
          <div>
            <span class="order-id">Order #{{ order.id }}</span>
            <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
          </div>
          <span class="status-badge" [class]="order.status.toLowerCase()">{{ order.status }}</span>
        </div>
        <div class="order-items-preview">
          <span *ngFor="let item of order.items; let last = last">
            {{ item.productName }} × {{ item.quantity }}{{ last ? '' : ', ' }}
          </span>
        </div>
        <div class="order-footer">
          <span class="total">Total: ₹{{ order.totalAmount | number:'1.2-2' }}</span>
          <div class="order-actions">
            <a [routerLink]="['/orders', order.id]" class="btn-view">View Details</a>
            <button class="btn-cancel"
                    *ngIf="order.status === 'PENDING'"
                    (click)="cancelOrder(order.id)">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { color: #1a237e; margin-bottom: 1.5rem; }
    .loading { text-align: center; padding: 3rem; color: #666; }
    .empty-state { text-align: center; padding: 4rem; }
    .empty-state p { color: #666; margin-bottom: 1.5rem; font-size: 1.1rem; }
    .btn-shop { background: #1a237e; color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; }
    .orders-list { display: flex; flex-direction: column; gap: 1rem; }
    .order-card {
      background: white; border-radius: 12px; padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .order-id { font-weight: 700; color: #1a237e; margin-right: 1rem; }
    .order-date { color: #888; font-size: 0.9rem; }
    .status-badge {
      padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
    }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.processing { background: #e3f2fd; color: #1565c0; }
    .status-badge.shipped { background: #e8eaf6; color: #3949ab; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .order-items-preview { color: #666; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.5; }
    .order-footer { display: flex; justify-content: space-between; align-items: center; }
    .total { font-weight: 700; color: #1a237e; font-size: 1.05rem; }
    .order-actions { display: flex; gap: 0.75rem; }
    .btn-view { background: #1a237e; color: white; padding: 0.45rem 1rem; border-radius: 6px; text-decoration: none; font-size: 0.9rem; }
    .btn-cancel { background: transparent; color: #c62828; border: 1.5px solid #c62828; padding: 0.4rem 0.9rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
  `]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loading = true;
      this.orderService.getUserOrders(user.userId).subscribe({
        next: orders => { this.orders = orders; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  cancelOrder(id: number) {
    this.orderService.cancelOrder(id).subscribe({
      next: updated => {
        const idx = this.orders.findIndex(o => o.id === id);
        if (idx !== -1) this.orders[idx] = updated;
      }
    });
  }
}
