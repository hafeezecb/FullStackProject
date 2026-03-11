import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/products">🛍️ ShopFlow</a>
      </div>
      <div class="nav-links">
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/cart" routerLinkActive="active" class="cart-link">
          Cart
          <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
        </a>
        <ng-container *ngIf="currentUser; else guestMenu">
          <a routerLink="/orders" routerLinkActive="active">My Orders</a>
          <span class="user-name">Hi, {{ currentUser.name }}</span>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #guestMenu>
          <a routerLink="/login" routerLinkActive="active">Login</a>
          <a routerLink="/register" routerLinkActive="active" class="btn-register">Register</a>
        </ng-template>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0 2rem; height: 64px; background: #1a237e; color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2); position: sticky; top: 0; z-index: 100;
    }
    .nav-brand a { color: white; text-decoration: none; font-size: 1.4rem; font-weight: 700; }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-links a { color: rgba(255,255,255,0.85); text-decoration: none; font-size: 0.95rem; transition: color 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: white; }
    .cart-link { position: relative; }
    .cart-badge {
      position: absolute; top: -8px; right: -10px;
      background: #f44336; color: white; border-radius: 50%;
      width: 18px; height: 18px; font-size: 0.7rem;
      display: flex; align-items: center; justify-content: center;
    }
    .user-name { color: rgba(255,255,255,0.7); font-size: 0.9rem; }
    .btn-logout {
      background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3);
      padding: 0.3rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.25); }
    .btn-register {
      background: #1565c0; padding: 0.3rem 0.9rem; border-radius: 4px; color: white !important;
    }
    .main-content { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  get currentUser() { return this.authService.getCurrentUser(); }
  get cartCount() { return this.cartService.getTotalItems(); }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
