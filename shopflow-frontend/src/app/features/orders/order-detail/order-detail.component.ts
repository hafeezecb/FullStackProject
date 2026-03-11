import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="loading" class="loading">Loading order...</div>

    <div *ngIf="order && !loading">
      <a routerLink="/orders" class="back-link">← Back to Orders</a>

      <div class="detail-card">
        <div class="detail-header">
          <div>
            <h1>Order #{{ order.id }}</h1>
            <p class="date">Placed on {{ order.createdAt | date:'fullDate' }}</p>
          </div>
          <span class="status-badge" [class]="order.status.toLowerCase()">{{ order.status }}</span>
        </div>

        <div class="section">
          <h2>Items</h2>
          <table>
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of order.items">
                <td>{{ item.productName }}</td>
                <td>{{ item.quantity }}</td>
                <td>₹{{ item.unitPrice | number:'1.2-2' }}</td>
                <td>₹{{ item.subtotal | number:'1.2-2' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section-grid">
          <div class="section">
            <h2>Shipping</h2>
            <p>{{ order.shippingAddress || 'Not specified' }}</p>
          </div>
          <div class="section summary-box">
            <h2>Order Total</h2>
            <div class="total-row"><span>Total Amount</span><span class="total-val">₹{{ order.totalAmount | number:'1.2-2' }}</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading { text-align: center; padding: 4rem; color: #666; }
    .back-link { color: #1a237e; text-decoration: none; display: inline-block; margin-bottom: 1.5rem; }
    .detail-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
    h1 { margin: 0 0 0.25rem; color: #1a237e; }
    .date { color: #888; margin: 0; font-size: 0.9rem; }
    .status-badge { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
    .status-badge.pending { background: #fff3e0; color: #e65100; }
    .status-badge.processing { background: #e3f2fd; color: #1565c0; }
    .status-badge.delivered { background: #e8f5e9; color: #2e7d32; }
    .status-badge.cancelled { background: #ffebee; color: #c62828; }
    .section { margin-bottom: 2rem; }
    .section h2 { color: #1a237e; font-size: 1.1rem; margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e8eaf6; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; background: #f5f7ff; color: #3949ab; font-size: 0.9rem; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.95rem; }
    .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .summary-box { background: #f5f7ff; padding: 1rem; border-radius: 10px; }
    .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-weight: 500; }
    .total-val { font-size: 1.3rem; font-weight: 700; color: #1a237e; }
    @media (max-width: 600px) { .section-grid { grid-template-columns: 1fr; } }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = false;

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.orderService.getOrder(id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
