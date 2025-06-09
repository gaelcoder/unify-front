import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface SenhaForm {
  novaSenha: FormControl<string | null>;
  confirmarSenha: FormControl<string | null>;
}

// Validador para comparar senhas com a assinatura correta
export const conferirSenhasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const novaSenha = control.get('novaSenha');
  const confirmarSenha = control.get('confirmarSenha');

  // Retorna null se os controles não existirem ou se um deles não tiver valor
  if (!novaSenha || !confirmarSenha || !novaSenha.value || !confirmarSenha.value) {
    return null;
  }

  // Retorna erro apenas se ambos tiverem valores e forem diferentes
  return novaSenha.value === confirmarSenha.value 
    ? null 
    : { senhasDiferentes: true };
};

@Component({
  selector: 'app-trocar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trocarsenha.component.html',
  styleUrls: ['./trocarsenha.component.css']
})
export class TrocarSenhaComponent implements OnInit {
  senhaForm!: FormGroup<SenhaForm>;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Verifica se o usuário está logado e é primeiro acesso
    const user = this.authService.currentUserValue;
    if (!user || !user.primeiroAcesso) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.senhaForm = this.fb.group<SenhaForm>({
      novaSenha: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6)],
        nonNullable: false
      }),
      confirmarSenha: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: false
      })
    }, { validators: conferirSenhasValidator });
  }

  get f() { return this.senhaForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.senhaForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const novaSenha = this.f.novaSenha.value || '';
    
    this.authService.alterarSenhaPrimeiroAcesso(novaSenha)
      .subscribe({
        next: () => {
          this.success = 'Senha alterada com sucesso!';
          this.loading = false;
          
          // Redireciona após 2 segundos
          setTimeout(() => {
            if (this.authService.isAdminGeral()) {
              this.router.navigate(['/dashboard-admin-geral']);
            } else if (this.authService.isAdminUniversidade()) {
              this.router.navigate(['/admin-universidade/dashboard']);
            } else if (this.authService.isFuncionario()) {
              this.router.navigate(['/dashboard-secretaria']);
            } else {
              this.router.navigate(['/home']);
            }
          }, 2000);
        },
        error: (err) => {
          this.error = 'Erro ao alterar senha: ' + 
            (err.error && typeof err.error === 'string' ? err.error : 'Tente novamente');
          this.loading = false;
        }
      });
  }
}