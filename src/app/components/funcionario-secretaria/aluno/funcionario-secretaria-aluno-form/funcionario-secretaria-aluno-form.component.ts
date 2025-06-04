import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../../../../services/aluno.service'; // Adjusted path
import { AlunoDTO } from '../../../../models/aluno.model'; // Adjusted path
import { Graduacao } from '../../../../models/graduacao.model'; // Added import
import { GraduacaoService } from '../../../../services/graduacao.service'; // Added import

@Component({
  selector: 'app-funcionario-secretaria-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ isEditMode ? 'Editar Aluno' : 'Novo Aluno' }} (Secretaria)</h2>

      <form [formGroup]="alunoForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input type="text" id="nome" formControlName="nome" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('nome')?.invalid && alunoForm.get('nome')?.touched }">
          <div *ngIf="alunoForm.get('nome')?.invalid && alunoForm.get('nome')?.touched" class="invalid-feedback">
            Nome é obrigatório.
          </div>
        </div>

        <div class="mb-3">
          <label for="sobrenome" class="form-label">Sobrenome</label>
          <input type="text" id="sobrenome" formControlName="sobrenome" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('sobrenome')?.invalid && alunoForm.get('sobrenome')?.touched }">
          <div *ngIf="alunoForm.get('sobrenome')?.invalid && alunoForm.get('sobrenome')?.touched" class="invalid-feedback">
            Sobrenome é obrigatório.
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('email')?.invalid && alunoForm.get('email')?.touched }">
          <div *ngIf="alunoForm.get('email')?.errors?.['required'] && alunoForm.get('email')?.touched" class="invalid-feedback">
            Email é obrigatório.
          </div>
          <div *ngIf="alunoForm.get('email')?.errors?.['email'] && alunoForm.get('email')?.touched" class="invalid-feedback">
            Formato de email inválido.
          </div>
        </div>

        <div class="mb-3">
          <label for="cpf" class="form-label">CPF</label>
          <input type="text" id="cpf" formControlName="cpf" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('cpf')?.invalid && alunoForm.get('cpf')?.touched }">
          <div *ngIf="alunoForm.get('cpf')?.invalid && alunoForm.get('cpf')?.touched" class="invalid-feedback">
            CPF é obrigatório.
          </div>
          <!-- TODO: Add CPF mask and validation -->
        </div>

        <div class="mb-3">
          <label for="dataNascimento" class="form-label">Data de Nascimento</label>
          <input type="date" id="dataNascimento" formControlName="dataNascimento" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('dataNascimento')?.invalid && alunoForm.get('dataNascimento')?.touched }">
          <div *ngIf="alunoForm.get('dataNascimento')?.invalid && alunoForm.get('dataNascimento')?.touched" class="invalid-feedback">
            Data de Nascimento é obrigatória.
          </div>
        </div>

        <div class="mb-3">
          <label for="telefone" class="form-label">Telefone</label>
          <input type="text" id="telefone" formControlName="telefone" class="form-control"
                 [ngClass]="{ 'is-invalid': alunoForm.get('telefone')?.invalid && alunoForm.get('telefone')?.touched }">
           <div *ngIf="alunoForm.get('telefone')?.invalid && alunoForm.get('telefone')?.touched" class="invalid-feedback">
            Telefone é obrigatório.
          </div>
          <!-- TODO: Add Telefone mask -->
        </div>

        <div class="mb-3">
          <label for="graduacaoId" class="form-label">Graduação</label>
          <select id="graduacaoId" formControlName="graduacaoId" class="form-select"
                  [ngClass]="{ 'is-invalid': alunoForm.get('graduacaoId')?.invalid && alunoForm.get('graduacaoId')?.touched }">
            <option [ngValue]="null" disabled>Selecione uma Graduação</option>
            <option *ngFor="let graduacao of todasGraduacoes" [value]="graduacao.id">{{ graduacao.titulo }}</option>
          </select>
          <div *ngIf="alunoForm.get('graduacaoId')?.invalid && alunoForm.get('graduacaoId')?.touched" class="invalid-feedback">
            Graduação é obrigatória.
          </div>
        </div>

        <div class="mt-3">
          <button type="submit" [disabled]="alunoForm.invalid || isLoading" class="btn btn-primary me-2">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isEditMode ? 'Salvar Alterações' : 'Criar Aluno' }}
          </button>
          <button type="button" (click)="goBack()" class="btn btn-secondary">Voltar</button>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>

      </form>
    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaAlunoFormComponent implements OnInit {
  alunoForm!: FormGroup;
  isEditMode = false;
  alunoId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  todasGraduacoes: Graduacao[] = []; // Added property

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    @Inject(GraduacaoService) private graduacaoService: GraduacaoService, // Added @Inject
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadGraduacoesDisponiveis(); // Added call
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.alunoId = +idParam;
      this.loadAlunoData();
    } else {
      this.isEditMode = false;
    }
  }

  initForm(): void {
    this.alunoForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      graduacaoId: [null, Validators.required] // Changed from graduacaoIds: [[], Validators.required]
    });
  }

  loadGraduacoesDisponiveis(): void { // Added method
    this.isLoading = true;
    // Assuming GraduacaoService has a method like listarTodas() or getGraduacoes()
    this.graduacaoService.listarTodas().subscribe({
      next: (graduacoes: Graduacao[]) => { // Added Graduacao[] type
        this.todasGraduacoes = graduacoes;
        this.isLoading = false;
      },
      error: (err: any) => { // Added any type for err
        console.error('Erro ao carregar graduações:', err);
        this.errorMessage = 'Erro ao carregar lista de graduações. Tente novamente mais tarde.';
        this.isLoading = false; // Ensure isLoading is set to false on error
      }
    });
  }

  loadAlunoData(): void {
    if (!this.alunoId) return;
    this.isLoading = true;
    this.alunoService.buscarAlunoPorId(this.alunoId).subscribe({
      next: (aluno) => {
        this.alunoForm.patchValue({
          nome: aluno.nome,
          sobrenome: aluno.sobrenome,
          email: aluno.email,
          cpf: aluno.cpf,
          dataNascimento: aluno.dataNascimento, 
          telefone: aluno.telefone,
          // Correctly patch graduacaoId from the first element of the aluno.graduacoes array
          graduacaoId: (aluno.graduacoes && aluno.graduacoes.length > 0 ? aluno.graduacoes[0].id : null)
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do aluno:', err);
        this.errorMessage = 'Erro ao carregar dados do aluno.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.alunoForm.invalid) {
      this.alunoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const alunoData: AlunoDTO = this.alunoForm.value;

    if (this.isEditMode && this.alunoId) {
      this.alunoService.atualizarAluno(this.alunoId, alunoData).subscribe({
        next: () => {
          alert('Aluno atualizado com sucesso!');
          this.router.navigate(['/funcionariosecretaria/alunos']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao atualizar aluno:', err);
          this.errorMessage = err.error?.message || 'Erro ao atualizar aluno. Tente novamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.alunoService.criarAluno(alunoData).subscribe({
        next: () => {
          alert('Aluno criado com sucesso!');
          this.router.navigate(['/funcionariosecretaria/alunos']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao criar aluno:', err);
          this.errorMessage = err.error?.message || 'Erro ao criar aluno. Tente novamente.';
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/funcionariosecretaria/alunos']);
  }
} 