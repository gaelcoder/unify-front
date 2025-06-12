import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlunoService } from '../../../../services/aluno.service';
import { AlunoDTO, Aluno } from '../../../../models/aluno.model';
import { Graduacao } from '../../../../models/graduacao.model';
import { GraduacaoService } from '../../../../services/graduacao.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-funcionario-secretaria-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
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
                 mask="000.000.000-00"
                 [ngClass]="{ 'is-invalid': alunoForm.get('cpf')?.invalid && alunoForm.get('cpf')?.touched }">
          <div *ngIf="alunoForm.get('cpf')?.invalid && alunoForm.get('cpf')?.touched" class="invalid-feedback">
            CPF é obrigatório.
          </div>
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
                 mask="(00) 00000-0000"
                 [ngClass]="{ 'is-invalid': alunoForm.get('telefone')?.invalid && alunoForm.get('telefone')?.touched }">
           <div *ngIf="alunoForm.get('telefone')?.invalid && alunoForm.get('telefone')?.touched" class="invalid-feedback">
            Telefone é obrigatório.
          </div>
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

        <div class="mb-3">
          <label for="campus" class="form-label">Campus</label>
          <select id="campus" formControlName="campus" class="form-select"
                  [ngClass]="{ 'is-invalid': alunoForm.get('campus')?.invalid && alunoForm.get('campus')?.touched }">
            <option [ngValue]="null" disabled>Selecione um Campus</option>
            <option *ngFor="let campus of campiDisponiveis" [value]="campus">{{ campus }}</option>
          </select>
          <div *ngIf="alunoForm.get('campus')?.invalid && alunoForm.get('campus')?.touched" class="invalid-feedback">
            Campus é obrigatório.
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
  todasGraduacoes: Graduacao[] = [];
  campiDisponiveis: string[] = [];

  constructor(
    private fb: FormBuilder,
    private alunoService: AlunoService,
    @Inject(GraduacaoService) private graduacaoService: GraduacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.alunoId = +idParam;
    }
    // Load graduations first, then load student data if in edit mode.
    this.loadGraduacoesAndThenAlunoData();
  }

  initForm(): void {
    this.alunoForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      graduacaoId: [null, Validators.required],
      campus: [{ value: null, disabled: true }, Validators.required]
    });

    this.alunoForm.get('graduacaoId')?.valueChanges.subscribe(graduacaoId => {
      this.onGraduacaoChange(graduacaoId);
    });
  }

  loadGraduacoesAndThenAlunoData(): void {
    this.isLoading = true;
    this.graduacaoService.listarTodas().subscribe({
      next: (graduacoes) => {
        this.todasGraduacoes = graduacoes;
        // If in edit mode, proceed to load the student's data
        if (this.isEditMode && this.alunoId) {
          this.loadAlunoData();
        } else {
          // If in create mode, we're done loading.
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar graduações:', err);
        this.errorMessage = 'Erro ao carregar lista de graduações.';
        this.isLoading = false;
      }
    });
  }

  onGraduacaoChange(graduacaoId: number | string | null): void {
    const campusControl = this.alunoForm.get('campus');
    const selectedId = graduacaoId !== null ? Number(graduacaoId) : null;

    if (selectedId) {
      const graduacaoSelecionada = this.todasGraduacoes.find(g => g.id === selectedId);
      this.campiDisponiveis = graduacaoSelecionada?.campusDisponiveis || [];
      
      if (this.campiDisponiveis.length > 0) {
        campusControl?.enable();
      } else {
        campusControl?.disable();
      }
    } else {
      this.campiDisponiveis = [];
      campusControl?.disable();
    }
    // Always reset the campus value when the graduation changes
    campusControl?.setValue(null);
  }

  loadAlunoData(): void {
    if (!this.alunoId) {
      this.isLoading = false;
      return;
    }
    // No need to set isLoading here, it's handled by the calling function
    this.alunoService.buscarAlunoPorId(this.alunoId).subscribe({
      next: (aluno: Aluno) => {
        this.patchFormWithAlunoData(aluno);
        this.isLoading = false; // Loading finishes here for edit mode
      },
      error: (err) => {
        console.error('Erro ao carregar dados do aluno:', err);
        this.errorMessage = 'Erro ao carregar dados do aluno.';
        this.isLoading = false;
      }
    });
  }

  patchFormWithAlunoData(aluno: any): void {
    this.alunoForm.patchValue({
      nome: aluno.nome,
      sobrenome: aluno.sobrenome,
      email: aluno.email,
      cpf: aluno.cpf,
      dataNascimento: aluno.dataNascimento,
      telefone: aluno.telefone,
      graduacaoId: aluno.graduacao?.id || null
    });
    this.alunoForm.get('cpf')?.disable();
  
    if (aluno.graduacao && aluno.graduacao.campusDisponiveis) {
      this.campiDisponiveis = aluno.graduacao.campusDisponiveis;
      this.alunoForm.get('campus')?.enable();
    }
    
    // Set the campus value after populating the options
    this.alunoForm.get('campus')?.setValue(aluno.campus);
  }

  onSubmit(): void {
    // When submitting, enable the campus control to get its value
    this.alunoForm.get('campus')?.enable({ onlySelf: true, emitEvent: false });

    if (this.isEditMode) {
      this.alunoForm.get('cpf')?.enable({ onlySelf: true, emitEvent: false });
    }

    if (this.alunoForm.invalid) {
      this.alunoForm.markAllAsTouched();
      // Disable campus again if validation fails to maintain UI state
      this.alunoForm.get('campus')?.disable({ onlySelf: true, emitEvent: false });

      if (this.isEditMode) {
        this.alunoForm.get('cpf')?.disable({ onlySelf: true, emitEvent: false });
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const alunoData: AlunoDTO = this.alunoForm.getRawValue();

    const operation = this.isEditMode && this.alunoId
      ? this.alunoService.atualizarAluno(this.alunoId, alunoData)
      : this.alunoService.criarAluno(alunoData);

    operation.subscribe({
      next: () => {
        alert(`Aluno ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        this.router.navigate(['/funcionariosecretaria/alunos']);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} aluno:`, err);
        this.errorMessage = err.error?.message || `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} aluno.`;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/funcionariosecretaria/alunos']);
  }
}
