import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [/* Importe os módulos necessários */],
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.css']
})
export class TrocarSenhaComponent implements OnInit {
  trocaSenhaForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  primeiroAcesso = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Verifica se o usuário está logado
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.primeiroAcesso = currentUser.primeiroAcesso;
    }
  }

  ngOnInit() {
    this.trocaSenhaForm = this.formBuilder.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', Validators.required]
    }, {
      validator: this.mustMatch('novaSenha', 'confirmacaoSenha')
    });
  }

  // Getter para facilitar o acesso aos campos do formulário
  get f() { return this.trocaSenhaForm.controls; }

  // Validador para verificar se as senhas coincidem
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      // Verifica se as senhas são iguais
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Para se o formulário for inválido
    if (this.trocaSenhaForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.trocarSenha(
      this.f['senhaAtual'].value,
      this.f['novaSenha'].value
    ).subscribe({
      next: () => {
        this.success = 'Senha alterada com sucesso!';
        this.loading = false;
        
        // Se for primeiro acesso, redireciona para o dashboard após 2 segundos
        if (this.primeiroAcesso) {
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        }
      },
      error: (error) => {
        this.error = error.error && typeof error.error === 'string'
          ? error.error
          : 'Erro ao trocar senha. Verifique se a senha atual está correta.';
        this.loading = false;
      }
    });
  }
}