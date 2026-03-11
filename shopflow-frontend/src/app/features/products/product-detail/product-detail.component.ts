import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div *ngIf="loading" class="loading">Loading...</div>

    <div *ngIf="product && !loading" class="detail-page">
      <a routerLink="/products" class="back-link">← Back to Products</a>

      <div class="detail-card">
        <div class="detail-image">
          <img [src]="product.imageUrl || 'https://placehold.co/500x380?text=' + product.name"
               [alt]="product.name" />
        </div>
        <div class="detail-info">
          <span class="category-badge">{{ product.category || 'General' }}</span>
          <h1>{{ product.name }}</h1>
          <p class="description">{{ product.description }}</p>
          <div class="price-row">
            <span class="price">₹{{ product.price | number:'1.2-2' }}</span>
            <span class="stock" [class.out]="product.stockQuantity === 0">
              {{ product.stockQuantity > 0 ? product.stockQuantity + ' in stock' : 'Out of stock' }}
            </span>
          </div>

          <div class="qty-row" *ngIf="product.stockQuantity > 0">
            <label>Quantity:</label>
            <div class="qty-control">
              <button (click)="qty > 1 ? qty = qty - 1 : null">−</button>
              <input type="number" [(ngModel)]="qty" [min]="1" [max]="product.stockQuantity" />
              <button (click)="qty < product.stockQuantity ? qty = qty + 1 : null">+</button>
            </div>
          </div>

          <button class="btn-add-cart" [disabled]="product.stockQuantity === 0" (click)="addToCart()">
            🛒 Add to Cart
          </button>

          <div class="toast-inline" *ngIf="added">✓ Added to cart!</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading { text-align: center; padding: 4rem; color: #666; }
    .back-link { color: #1a237e; text-decoration: none; font-size: 0.95rem; display: inline-block; margin-bottom: 1.5rem; }
    .detail-card {
      display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;
      background: white; border-radius: 16px; padding: 2.5rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .detail-image img { width: 100%; border-radius: 12px; object-fit: cover; }
    .category-badge { background: #e8eaf6; color: #3949ab; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    h1 { margin: 0.75rem 0 1rem; color: #1a237e; font-size: 1.8rem; }
    .description { color: #555; line-height: 1.7; margin-bottom: 1.5rem; }
    .price-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }
    .price { font-size: 2rem; font-weight: 700; color: #1a237e; }
    .stock { color: #388e3c; font-weight: 500; }
    .stock.out { color: #c62828; }
    .qty-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    label { font-weight: 500; }
    .qty-control { display: flex; align-items: center; gap: 0; }
    .qty-control button {
      width: 36px; height: 36px; background: #e8eaf6; border: 1px solid #c5cae9;
      font-size: 1.2rem; cursor: pointer; border-radius: 4px;
    }
    .qty-control input {
      width: 60px; height: 36px; text-align: center; border: 1px solid #c5cae9;
      font-size: 1rem; margin: 0 4px;
    }
    .btn-add-cart {
      width: 100%; padding: 1rem; background: #1a237e; color: white;
      border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer;
    }
    .btn-add-cart:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-add-cart:hover:not(:disabled) { background: #283593; }
    .toast-inline { margin-top: 1rem; padding: 0.75rem; background: #e8f5e9; color: #2e7d32; border-radius: 8px; text-align: center; font-weight: 500; }
    @media (max-width: 700px) { .detail-card { grid-template-columns: 1fr; } }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  qty = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.qty);
      this.added = true;
      setTimeout(() => this.added = false, 2000);
    }
  }
}
