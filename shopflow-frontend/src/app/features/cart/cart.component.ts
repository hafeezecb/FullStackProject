import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h1>Shopping Cart</h1>

    <div class="empty-cart" *ngIf="items.length === 0">
      <p>🛒 Your cart is empty</p>
      <a routerLink="/products" class="btn-shop">Browse Products</a>
    </div>

    <div class="cart-layout" *ngIf="items.length > 0">
      <div class="cart-items">
        <div class="cart-item" *ngFor="let item of items">
          <img [src]="item.product.imageUrl || 'https://placehold.co/80x80?text=P'"
               [alt]="item.product.name" />
          <div class="item-info">
            <h3>{{ item.product.name }}</h3>
            <p>₹{{ item.product.price | number:'1.2-2' }}</p>
          </div>
          <div class="qty-control">
            <button (click)="updateQty(item, item.quantity - 1)">−</button>
            <span>{{ item.quantity }}</span>
            <button (click)="updateQty(item, item.quantity + 1)"
                    [disabled]="item.quantity >= item.product.stockQuantity">+</button>
          </div>
          <span class="subtotal">₹{{ item.product.price * item.quantity | number:'1.2-2' }}</span>
          <button class="btn-remove" (click)="remove(item.product.id)">✕</button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row"><span>Items ({{ totalItems }})</span><span>₹{{ totalPrice | number:'1.2-2' }}</span></div>
        <div class="summary-row"><span>Shipping</span><span>Free</span></div>
        <div class="summary-row total"><span>Total</span><span>₹{{ totalPrice | number:'1.2-2' }}</span></div>

        <div class="form-group">
          <label>Shipping Address</label>
          <textarea [(ngModel)]="shippingAddress" rows="3" placeholder="Enter your full address..."></textarea>
        </div>

        <div class="alert error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="alert success" *ngIf="successMsg">{{ successMsg }}</div>

        <button class="btn-order" (click)="placeOrder()" [disabled]="placing">
          {{ placing ? 'Placing Order...' : 'Place Order' }}
        </button>
        <button class="btn-clear" (click)="clearCart()">Clear Cart</button>
      </div>
    </div>
  `,
  styles: [`
    h1 { color: #1a237e; margin-bottom: 1.5rem; }
    .empty-cart { text-align: center; padding: 4rem; }
    .empty-cart p { font-size: 1.2rem; color: #666; margin-bottom: 1.5rem; }
    .btn-shop { background: #1a237e; color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; }
    .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start; }
    .cart-items { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .cart-item {
      display: grid; grid-template-columns: 80px 1fr auto auto auto; gap: 1rem;
      align-items: center; padding: 1rem 0; border-bottom: 1px solid #f0f0f0;
    }
    .cart-item:last-child { border-bottom: none; }
    .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
    .item-info h3 { margin: 0 0 0.25rem; font-size: 1rem; color: #1a237e; }
    .item-info p { margin: 0; color: #666; font-size: 0.9rem; }
    .qty-control { display: flex; align-items: center; gap: 0.5rem; }
    .qty-control button { width: 28px; height: 28px; background: #e8eaf6; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .qty-control span { font-weight: 600; min-width: 20px; text-align: center; }
    .subtotal { font-weight: 600; color: #1a237e; }
    .btn-remove { background: none; border: none; color: #999; cursor: pointer; font-size: 1rem; }
    .btn-remove:hover { color: #c62828; }
    .cart-summary {
      background: white; border-radius: 12px; padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06); position: sticky; top: 80px;
    }
    .cart-summary h2 { margin: 0 0 1.25rem; color: #1a237e; font-size: 1.2rem; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; color: #555; font-size: 0.95rem; border-bottom: 1px solid #f5f5f5; }
    .summary-row.total { font-size: 1.1rem; font-weight: 700; color: #1a237e; border-bottom: none; margin: 0.5rem 0 1rem; }
    .form-group { margin-bottom: 1rem; }
    label { font-size: 0.9rem; font-weight: 500; display: block; margin-bottom: 0.4rem; }
    textarea { width: 100%; padding: 0.75rem; border: 1.5px solid #ddd; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box; resize: vertical; }
    .btn-order {
      width: 100%; padding: 0.85rem; background: #1a237e; color: white;
      border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-bottom: 0.75rem;
    }
    .btn-order:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-clear { width: 100%; padding: 0.75rem; background: transparent; color: #c62828; border: 1.5px solid #c62828; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .alert { padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; }
    .alert.error { background: #ffebee; color: #c62828; }
    .alert.success { background: #e8f5e9; color: #2e7d32; }
    @media (max-width: 800px) { .cart-layout { grid-template-columns: 1fr; } }
  `]
})
export class CartComponent {
  shippingAddress = '';
  placing = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  get items(): CartItem[] { return this.cartService.items; }
  get totalItems(): number { return this.cartService.getTotalItems(); }
  get totalPrice(): number { return this.cartService.getTotalPrice(); }

  updateQty(item: CartItem, qty: number) {
    this.cartService.updateQuantity(item.product.id, qty);
  }

  remove(productId: number) { this.cartService.removeItem(productId); }
  clearCart() { this.cartService.clearCart(); }

  placeOrder() {
    if (!this.shippingAddress.trim()) {
      this.errorMsg = 'Please enter a shipping address.';
      return;
    }
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/login']); return; }

    this.placing = true;
    this.errorMsg = '';
    const request = {
      userId: user.userId,
      shippingAddress: this.shippingAddress,
      items: this.items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price
      }))
    };

    this.orderService.createOrder(request).subscribe({
      next: order => {
        this.cartService.clearCart();
        this.successMsg = `Order #${order.id} placed successfully!`;
        setTimeout(() => this.router.navigate(['/orders']), 1800);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Failed to place order. Try again.';
        this.placing = false;
      }
    });
  }
}
