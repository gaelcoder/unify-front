import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [/* Importe os módulos necessários */],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redireciona para o dashboard se já estiver logado
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    // Inicializa o formulário
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    // Obtém a URL de retorno dos parâmetros da rota ou usa o padrão
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
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

    this.authService.login(this.f['email'].value, this.f['senha'].value)
      .subscribe({
        next: (user) => {
          // Se for primeiro acesso, redireciona para troca de senha
          if (user.primeiroAcesso) {
            this.router.navigate(['/trocar-senha']);
          } else {
            // Senão, redireciona para a página solicitada
            this.router.navigate([this.returnUrl]);
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
}