import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Products</h1>
      <div class="filters">
        <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()"
               placeholder="Search products..." class="search-input" />
        <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
      </div>
    </div>

    <div class="loading" *ngIf="loading">Loading products...</div>

    <div class="product-grid" *ngIf="!loading">
      <div class="product-card" *ngFor="let product of products">
        <div class="product-image">
          <img [src]="product.imageUrl || 'https://placehold.co/300x200?text=Product'"
               [alt]="product.name" />
        </div>
        <div class="product-body">
          <span class="category-badge">{{ product.category || 'General' }}</span>
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description.length > 80 ? (product.description | slice:0:80) + '...' : product.description }},,</p>
          <div class="product-footer">
            <span class="price">₹{{ product.price | number:'1.2-2' }}</span>
            <span class="stock" [class.out-of-stock]="product.stockQuantity === 0">
              {{ product.stockQuantity > 0 ? 'In Stock (' + product.stockQuantity + ')' : 'Out of Stock' }}
            </span>
          </div>
          <div class="card-actions">
            <a [routerLink]="['/products', product.id]" class="btn-secondary">View Details</a>
            <button class="btn-primary"
                    [disabled]="product.stockQuantity === 0"
                    (click)="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" *ngIf="!loading && products.length === 0">
      <p>No products found. Try a different search.</p>
    </div>

    <div class="toast" *ngIf="toastMsg" [class.show]="toastMsg">{{ toastMsg }}</div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    h1 { margin: 0; color: #1a237e; }
    .filters { display: flex; gap: 1rem; }
    .search-input, select {
      padding: 0.6rem 1rem; border: 1.5px solid #ddd; border-radius: 8px; font-size: 0.95rem;
    }
    .search-input { min-width: 220px; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 1.5rem; }
    .product-card {
      background: white; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .product-image img { width: 100%; height: 180px; object-fit: cover; }
    .product-body { padding: 1.25rem; }
    .category-badge {
      display: inline-block; padding: 0.2rem 0.6rem;
      background: #e8eaf6; color: #3949ab; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
      margin-bottom: 0.5rem;
    }
    h3 { margin: 0.25rem 0 0.5rem; color: #1a237e; font-size: 1.05rem; }
    .description { color: #666; font-size: 0.88rem; margin: 0 0 0.75rem; line-height: 1.4; }
    .product-footer { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .price { font-size: 1.25rem; font-weight: 700; color: #1a237e; }
    .stock { font-size: 0.8rem; color: #388e3c; }
    .stock.out-of-stock { color: #c62828; }
    .card-actions { display: flex; gap: 0.75rem; }
    .btn-primary, .btn-secondary {
      flex: 1; padding: 0.55rem; border-radius: 8px; font-size: 0.9rem;
      cursor: pointer; text-align: center; font-weight: 500;
    }
    .btn-primary { background: #1a237e; color: white; border: none; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: transparent; color: #1a237e; border: 1.5px solid #1a237e; text-decoration: none; display: flex; align-items: center; justify-content: center; }
    .loading, .empty-state { text-align: center; padding: 4rem; color: #666; }
    .toast {
      position: fixed; bottom: 2rem; right: 2rem; background: #2e7d32; color: white;
      padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.95rem;
      opacity: 0; transform: translateY(20px); transition: all 0.3s;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food'];
  selectedCategory = '';
  searchTerm = '';
  loading = false;
  toastMsg = '';

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() { this.loadProducts(); }

  loadProducts() {
    this.loading = true;
    this.productService.getAll(this.selectedCategory || undefined, this.searchTerm || undefined)
      .subscribe({
        next: products => { this.products = products; this.loading = false; },
        error: () => { this.loading = false; }
      });
  }

  onSearch() { this.loadProducts(); }
  onCategoryChange() { this.loadProducts(); }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.showToast(`${product.name} added to cart!`);
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    setTimeout(() => this.toastMsg = '', 2500);
  }
}
