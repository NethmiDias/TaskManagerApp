import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly mode = signal<'login' | 'register'>('login');
  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
  });

  toggleMode() {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    try {
      const { username, password } = this.form.getRawValue();
      if (this.mode() === 'login') {
        await this.auth.login({ username, password });
      } else {
        await this.auth.register({ username, password });
      }
      await this.router.navigateByUrl('/tasks');
    } catch (e: unknown) {
      this.snack.open(e instanceof Error ? e.message : 'Authentication failed', 'Close', {
        duration: 4000
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }
}

