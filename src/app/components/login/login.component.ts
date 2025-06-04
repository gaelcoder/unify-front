import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl<string | null>;
  senha: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // If user is already logged in, AuthService.login will handle redirection if re-attempted or guard will prevent access.
    // No need for proactive redirect from here if AuthService handles it post-login.
    if (this.authService.currentUserValue && !this.authService.isPrimeiroAcesso()) {
        // Potentially navigate away if already logged in and not on a protected flow that brought them here.
        // However, the authGuard should ideally handle this by redirecting from /login if already authenticated.
        // For now, let AuthService.login() be the primary driver post-actual-login-attempt.
        // A simple check can be, if not primeiroAcesso, redirect to home or a default dashboard to avoid staying on login page.
        // This logic is tricky as it might conflict with returnUrl patterns from guards.
        // The AuthService now handles redirection after login, so this specific ngOnInit redirect might be redundant or conflict.
        // Consider removing or simplifying this ngOnInit block if authGuard and AuthService provide sufficient redirection.
        console.log('[LoginComponent OnInit] User already logged in. AuthService will handle redirection on next login attempt or guard should prevent access.');
    }

    this.loginForm = this.formBuilder.group<LoginForm>({
      email: this.formBuilder.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: false
      }),
      senha: this.formBuilder.control('', {
        validators: [Validators.required],
        nonNullable: false
      })
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loading = false; // Stop loading if form is invalid
      return;
    }

    this.loading = true;
    this.error = '';

    const email = this.f.email.value || '';
    const senha = this.f.senha.value || '';

    this.authService.login(email, senha)
      .subscribe({
        next: (responseWithTargetPath) => { // Renamed to reflect new structure
          console.log('[LoginComponent onSubmit] Login response from AuthService:', responseWithTargetPath);
          this.loading = false;

          // AuthService handles navigation for primeiroAcesso directly in the service.
          // So, if it's primeiroAcesso, we don't navigate from here.
          if (!responseWithTargetPath.primeiroAcesso && responseWithTargetPath.targetPath) {
            console.log(`[LoginComponent onSubmit] Not primeiroAcesso. Navigating to targetPath from AuthService: ${responseWithTargetPath.targetPath}`);
            this.router.navigate([responseWithTargetPath.targetPath]);
          } else if (responseWithTargetPath.primeiroAcesso) {
            console.log('[LoginComponent onSubmit] Primeiro acesso. AuthService has already handled redirection to /trocar-senha.');
          } else {
            // Fallback if somehow targetPath isn't set but not primeiroAcesso (should generally not happen)
            console.warn('[LoginComponent onSubmit] Login successful, but no specific targetPath and not primeiroAcesso. Navigating to /home as default (fallback).');
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          // Ensure error is properly structured for display
          if (err.error && typeof err.error === 'object' && err.error.message) {
            this.error = err.error.message;
          } else if (typeof err.error === 'string') {
            this.error = err.error;
          } else if (err.message) {
            this.error = err.message;
          } else {
            this.error = 'Credenciais inválidas ou erro no servidor.';
          }
          console.error('[LoginComponent onSubmit] Login error:', err);
          this.loading = false;
        }
      });
  }
  // Removed redirecionarUsuario() method as its logic is now in AuthService
}