import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        <p class="subtitle">Join ShopFlow today</p>

        <div class="alert error" *ngIf="errorMsg">{{ errorMsg }}</div>
        <div class="alert success" *ngIf="successMsg">{{ successMsg }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="John Doe" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password"
                   placeholder="Min. 6 characters" minlength="6" required />
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 70vh; }
    .auth-card {
      background: white; padding: 2.5rem; border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1); width: 100%; max-width: 420px;
    }
    h2 { margin: 0 0 0.25rem; color: #1a237e; font-size: 1.8rem; }
    .subtitle { color: #666; margin: 0 0 1.5rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: 500; color: #333; font-size: 0.9rem; }
    input {
      width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #ddd;
      border-radius: 8px; font-size: 1rem; box-sizing: border-box; transition: border-color 0.2s;
    }
    input:focus { outline: none; border-color: #1a237e; }
    .btn-primary {
      width: 100%; padding: 0.85rem; background: #1a237e; color: white;
      border: none; border-radius: 8px; font-size: 1rem; font-weight: 600;
      cursor: pointer; margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) { background: #283593; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .alert { padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem; }
    .alert.error { background: #ffebee; color: #c62828; }
    .alert.success { background: #e8f5e9; color: #2e7d32; }
    .auth-footer { text-align: center; margin-top: 1.5rem; color: #666; font-size: 0.9rem; }
    .auth-footer a { color: #1a237e; font-weight: 600; }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.successMsg = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
