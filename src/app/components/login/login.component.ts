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
    // Redireciona se já estiver logado
    if (this.authService.currentUserValue) {
      this.redirecionarUsuario();
    }
  }

  ngOnInit() {
    // Inicializa o formulário com sintaxe tipada
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

    // Para se o formulário for inválido
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
          // Se for primeiro acesso, redireciona para troca de senha
          if (user.primeiroAcesso) {
            this.router.navigate(['/trocar-senha']);
          } else {
            // Senão, redireciona baseado no tipo de usuário
            this.redirecionarUsuario();
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

  // Redireciona o usuário baseado no seu tipo
  redirecionarUsuario() {
    if (this.authService.isAdminGeral()) {
      this.router.navigate(['/representantes']);
    } else if (this.authService.isAdminUniversidade()) {
      this.router.navigate(['/admin-universidade']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}