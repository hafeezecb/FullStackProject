import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  get items(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(product: Product, quantity = 1): void {
    const current = [...this.items];
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stockQuantity);
    } else {
      current.push({ product, quantity });
    }
    this.cartSubject.next(current);
  }

  removeItem(productId: number): void {
    this.cartSubject.next(this.items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    const current = [...this.items];
    const item = current.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.cartSubject.next(current.filter(i => i.product.id !== productId));
        return;
      }
    }
    this.cartSubject.next(current);
  }

  clearCart(): void {
    this.cartSubject.next([]);
  }

  getTotalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
}
