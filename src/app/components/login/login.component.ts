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
  ) {
    // Constructor is now cleaner, ngOnInit will handle initial state.
  }

  ngOnInit() {
    // If user is already logged in and not in a 'primeiroAcesso' state,
    // try to redirect them away from login, unless they were sent here by a guard with a returnUrl.
    if (this.authService.currentUserValue && !this.authService.isPrimeiroAcesso()) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (!returnUrl) { 
            console.log('[LoginComponent OnInit] User already logged in, not primeiroAcesso, no returnUrl. Attempting proactive redirect.');
            this.redirecionarUsuario();
        } else {
            console.log(`[LoginComponent OnInit] User already logged in, but returnUrl (${returnUrl}) exists. Staying on login page for guard to handle.`);
        }
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

  // Getter para facilitar o acesso aos campos do formulário
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
          if (user.primeiroAcesso) {
            console.log('[LoginComponent onSubmit] Primeiro acesso detectado. Redirecionando para /trocar-senha');
            this.router.navigate(['/trocar-senha']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            if (returnUrl) {
              console.log(`[LoginComponent onSubmit] Login successful. Navigating to returnUrl: ${returnUrl}`);
              this.router.navigateByUrl(returnUrl);
            } else {
              console.log('[LoginComponent onSubmit] Login successful. No returnUrl. Redirecionando usuário com base no tipo.');
              this.redirecionarUsuario();
            }
          }
        },
        error: (error) => {
          this.error = error.error && typeof error.error === 'string'
            ? error.error
            : 'Credenciais inválidas. Por favor, tente novamente.';
          this.loading = false;
        }
      });
  }

  redirecionarUsuario() {
    const isAdminGeral = this.authService.isAdminGeral();
    const isAdminUniversidade = this.authService.isAdminUniversidade();
    const currentUserTipo = this.authService.currentUserValue?.tipo;

    console.log(`[LoginComponent redirecionarUsuario] isAdminGeral: ${isAdminGeral}, isAdminUniversidade: ${isAdminUniversidade}, currentUserTipo: ${currentUserTipo}`);

    if (isAdminGeral) {
      console.log('[LoginComponent redirecionarUsuario] Redirecionando para /dashboard-admin-geral');
      this.router.navigate(['/dashboard-admin-geral']);
    } else if (isAdminUniversidade) {
      console.log('[LoginComponent redirecionarUsuario] Redirecionando para /dashboard-admin-universidade');
      this.router.navigate(['/dashboard-admin-universidade']);
    } else {
      console.log('[LoginComponent redirecionarUsuario] Redirecionando para /home');
      this.router.navigate(['/home']);
    }
  }
}