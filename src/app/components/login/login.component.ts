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
      return;
    }

    this.loading = true;
    this.error = '';

    const email = this.f.email.value || '';
    const senha = this.f.senha.value || '';

    this.authService.login(email, senha)
      .subscribe({
        next: (user) => {
          console.log('[LoginComponent onSubmit] Login successful. User data received:', user);
          // AuthService.login() now handles all redirection logic, including primeiroAcesso and role-based dashboards.
          // The returnUrl logic could also be centralized in AuthService or handled by the authGuard.
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl && !user.primeiroAcesso) { // Only navigate to returnUrl if not first access
            console.log(`[LoginComponent onSubmit] Login successful. Navigating to returnUrl: ${returnUrl}`);
            this.router.navigateByUrl(returnUrl);
          } else if (!user.primeiroAcesso) {
            // If no returnUrl, and not primeiroAcesso, AuthService has already navigated.
            // If it IS primeiroAcesso, AuthService has already navigated to /trocar-senha
            console.log('[LoginComponent onSubmit] Login successful. AuthService handled redirection or it was first access.');
          } else {
            // This case is if user.primeiroAcesso is true. AuthService already handled it.
             console.log('[LoginComponent onSubmit] Primeiro acesso. AuthService handled redirection to /trocar-senha.');
          }
          // No explicit this.router.navigate here unless it's for returnUrl and not primeiroAcesso
        },
        error: (err) => {
          this.error = err.error?.message || err.error || 'Credenciais inválidas ou erro no servidor.';
          this.loading = false;
        }
      });
  }
  // Removed redirecionarUsuario() method as its logic is now in AuthService
}