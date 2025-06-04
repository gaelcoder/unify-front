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
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4>Alterar Senha - Primeiro Acesso</h4>
            </div>
            <div class="card-body">
              <form [formGroup]="senhaForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="novaSenha" class="form-label">Nova Senha</label>
                  <input type="password" id="novaSenha" formControlName="novaSenha" 
                         class="form-control" [ngClass]="{'is-invalid': submitted && f.novaSenha.errors}">
                  <div *ngIf="submitted && f.novaSenha.errors" class="invalid-feedback">
                    <div *ngIf="f.novaSenha.errors['required']">Senha é obrigatória</div>
                    <div *ngIf="f.novaSenha.errors['minlength']">Senha deve ter pelo menos 6 caracteres</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="confirmarSenha" class="form-label">Confirmar Senha</label>
                  <input type="password" id="confirmarSenha" formControlName="confirmarSenha" 
                         class="form-control" [ngClass]="{'is-invalid': submitted && (f.confirmarSenha.errors || senhaForm.hasError('senhasDiferentes'))}">
                  <div *ngIf="submitted && f.confirmarSenha.errors" class="invalid-feedback">
                    <div *ngIf="f.confirmarSenha.errors['required']">Confirmação de senha é obrigatória</div>
                  </div>
                  <div *ngIf="submitted && senhaForm.hasError('senhasDiferentes')" class="text-danger mt-1 small">
                    Senhas não conferem
                  </div>
                </div>
                
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    Salvar Nova Senha
                  </button>
                </div>
                
                <div *ngIf="error" class="alert alert-danger mt-3">{{error}}</div>
                <div *ngIf="success" class="alert alert-success mt-3">{{success}}</div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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