import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GraduacaoService } from '../../../../services/graduacao.service';
import { GraduacaoDTO, Graduacao } from '../../../../models/graduacao.model';
import { AuthService } from '../../../../services/auth.service';
import { ProfessorService } from '../../../../services/professor.service';
import { Professor } from '../../../../models/professor.model';
import { UniversidadeService } from '../../../../services/universidade.service';
import { Universidade } from '../../../../models/universidade.model';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-funcionario-secretaria-graduacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ isEditMode ? 'Editar Graduação' : 'Nova Graduação' }}</h2>

      <form [formGroup]="graduacaoForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título da Graduação</label>
          <input type="text" id="titulo" formControlName="titulo" class="form-control"
                 [ngClass]="{ 'is-invalid': graduacaoForm.get('titulo')?.invalid && graduacaoForm.get('titulo')?.touched }">
          <div *ngIf="graduacaoForm.get('titulo')?.invalid && graduacaoForm.get('titulo')?.touched" class="invalid-feedback">
            Título é obrigatório.
          </div>
        </div>

        <div class="mb-3">
          <label for="semestres" class="form-label">Semestres</label>
          <input type="number" id="semestres" formControlName="semestres" class="form-control"
                 [ngClass]="{ 'is-invalid': graduacaoForm.get('semestres')?.invalid && graduacaoForm.get('semestres')?.touched }">
          <div *ngIf="graduacaoForm.get('semestres')?.errors?.['required'] && graduacaoForm.get('semestres')?.touched" class="invalid-feedback">
            Número de semestres é obrigatório.
          </div>
           <div *ngIf="graduacaoForm.get('semestres')?.errors?.['min'] && graduacaoForm.get('semestres')?.touched" class="invalid-feedback">
            Número de semestres deve ser no mínimo 1.
          </div>
        </div>

        <div class="mb-3">
          <label for="codigoCurso" class="form-label">Código do Curso</label>
          <input type="text" id="codigoCurso" formControlName="codigoCurso" class="form-control"
                 [ngClass]="{ 'is-invalid': graduacaoForm.get('codigoCurso')?.invalid && graduacaoForm.get('codigoCurso')?.touched }">
          <div *ngIf="graduacaoForm.get('codigoCurso')?.invalid && graduacaoForm.get('codigoCurso')?.touched" class="invalid-feedback">
            Código do curso é obrigatório.
          </div>
        </div>
        
        <div class="mb-3">
          <label for="coordenadorDoCursoId" class="form-label">Coordenador do Curso (Opcional)</label>
          <select id="coordenadorDoCursoId" formControlName="coordenadorDoCursoId" class="form-select">
            <option [ngValue]="null">Nenhum</option>
            <option *ngFor="let prof of professoresDisponiveis" [value]="prof.id">
              {{ prof.nome }} {{ prof.sobrenome }}
            </option>
          </select>
          <div *ngIf="isLoadingProfessores" class="form-text">Carregando professores...</div>
        </div>

        <!-- DUAL LISTBOX FOR CAMPI SELECTION -->
        <div class="mb-3">
          <label class="form-label">Campi Disponíveis</label>
          <div *ngIf="isLoadingCampi" class="form-text">Carregando campi...</div>
          <div *ngIf="!isLoadingCampi && campiDaUniversidade.length === 0" class="alert alert-info">Nenhum campus configurado para esta universidade.</div>
          
          <div *ngIf="!isLoadingCampi && campiDaUniversidade.length > 0" class="row">
            <!-- Available Campi Column -->
            <div class="col-md-5">
              <h6>Disponíveis</h6>
              <div class="list-group border rounded overflow-auto" style="height: 200px;">
                <button type="button" *ngFor="let campus of availableCampi" 
                        class="list-group-item list-group-item-action"
                        (click)="selectCampus(campus)">
                  {{ campus }}
                </button>
                <div *ngIf="availableCampi.length === 0" class="list-group-item text-muted">Nenhum campus disponível.</div>
              </div>
            </div>

            <!-- Action Buttons Column -->
            <div class="col-md-2 d-flex flex-column align-items-center justify-content-center">
              <button type="button" class="btn btn-outline-primary btn-sm mb-2 w-100" (click)="selectAllCampi()" title="Selecionar Todos">&gt;&gt;</button>
              <button type="button" class="btn btn-outline-primary btn-sm mt-2 w-100" (click)="deselectAllCampi()" title="Remover Todos">&lt;&lt;</button>
            </div>

            <!-- Selected Campi Column -->
            <div class="col-md-5">
              <h6>Selecionados</h6>
              <div class="list-group border rounded overflow-auto" style="height: 200px;">
                <button type="button" *ngFor="let campus of selectedCampi"
                        class="list-group-item list-group-item-action"
                        (click)="deselectCampus(campus)">
                  {{ campus }}
                </button>
                <div *ngIf="selectedCampi.length === 0" class="list-group-item text-muted">Nenhum campus selecionado.</div>
              </div>
            </div>
          </div>
        </div>
        <!-- END DUAL LISTBOX -->

        <div class="mt-3">
          <button type="submit" [disabled]="graduacaoForm.invalid || isLoading || isLoadingProfessores || isLoadingCampi" class="btn btn-primary me-2">
            <span *ngIf="isLoading || isLoadingProfessores || isLoadingCampi" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isEditMode ? 'Salvar Alterações' : 'Criar Graduação' }}
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
export class FuncionarioSecretariaGraduacaoFormComponent implements OnInit {
  graduacaoForm!: FormGroup;
  isEditMode = false;
  graduacaoId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  professoresDisponiveis: Professor[] = [];
  isLoadingProfessores = false;
  campiDaUniversidade: string[] = [];
  isLoadingCampi = false;
  
  private universidadeIdDoUsuario: number | undefined;

  constructor(
    private fb: FormBuilder,
    private graduacaoService: GraduacaoService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private professorService: ProfessorService,
    private universidadeService: UniversidadeService
  ) {
    this.universidadeIdDoUsuario = this.authService.currentUserValue?.universidadeId;
  }

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.graduacaoId = +idParam;
    } else {
      this.isEditMode = false;
    }
    this.loadRelatedData();
  }

  initForm(): void {
    this.graduacaoForm = this.fb.group({
      titulo: ['', Validators.required],
      semestres: [null, [Validators.required, Validators.min(1)]],
      codigoCurso: ['', Validators.required],
      coordenadorDoCursoId: [null],
      campiSelecionados: [[]]
    });
  }

  get selectedCampi(): string[] {
    return this.graduacaoForm.get('campiSelecionados')?.value || [];
  }

  get availableCampi(): string[] {
    const selected = this.selectedCampi;
    return this.campiDaUniversidade.filter(c => !selected.includes(c)).sort((a, b) => a.localeCompare(b));
  }
  
  selectCampus(campus: string): void {
    const currentSelected = this.selectedCampi;
    if (!currentSelected.includes(campus)) {
      this.graduacaoForm.get('campiSelecionados')?.setValue([...currentSelected, campus].sort((a, b) => a.localeCompare(b)));
    }
  }

  deselectCampus(campus: string): void {
    const currentSelected = this.selectedCampi;
    this.graduacaoForm.get('campiSelecionados')?.setValue(currentSelected.filter(c => c !== campus).sort((a, b) => a.localeCompare(b)));
  }

  selectAllCampi(): void {
    this.graduacaoForm.get('campiSelecionados')?.setValue([...this.campiDaUniversidade].sort((a, b) => a.localeCompare(b)));
  }

  deselectAllCampi(): void {
    this.graduacaoForm.get('campiSelecionados')?.setValue([]);
  }

  loadRelatedData(): void {
    if (!this.universidadeIdDoUsuario) {
      this.errorMessage = 'Não foi possível identificar a universidade do usuário.';
      this.isLoadingProfessores = false; 
      this.isLoadingCampi = false;
      return;
    }
    this.isLoadingProfessores = true;
    this.isLoadingCampi = true;
    this.errorMessage = null; 

    forkJoin({
      professores: this.professorService.listarProfessoresPorUniversidadeId(this.universidadeIdDoUsuario).pipe(
        catchError(err => {
          console.error('Erro ao carregar professores:', err);
          this.errorMessage = (this.errorMessage || '') + ' Erro ao carregar professores.';
          return of([]); 
        })
      ),
      universidade: this.universidadeService.buscarUniversidadePorId(this.universidadeIdDoUsuario).pipe(
        tap(uni => console.log('[Debug] Raw universidade data from service:', uni)),
        catchError(err => {
          console.error('Erro ao carregar dados da universidade/campi:', err);
          this.errorMessage = (this.errorMessage || '') + ' Erro ao carregar campi.';
          return of(null); 
        })
      )
    }).subscribe({
      next: (results) => {
        this.professoresDisponiveis = results.professores;
        this.campiDaUniversidade = results.universidade?.campus || [];
        console.log('[Debug] loadRelatedData - campiDaUniversidade set to:', this.campiDaUniversidade);

        if (this.isEditMode && this.graduacaoId) {
          this.loadGraduacaoData();
        } else if (!this.isEditMode) {
          this.isLoadingProfessores = false; 
          this.isLoadingCampi = false;
        }
      },
      error: (err) => { 
        console.error('Erro ao carregar dados relacionados (professores/universidade):', err);
        this.errorMessage = (this.errorMessage || '') + ' Erro fatal ao carregar dados necessários para o formulário.';
        this.isLoadingProfessores = false;
        this.isLoadingCampi = false;
      }
    });
  }

  loadGraduacaoData(): void {
    if (!this.graduacaoId) {
        this.isLoadingProfessores = false; 
        this.isLoadingCampi = false;
        return;
    }
    this.isLoading = true; 

    this.graduacaoService.buscarGraduacaoParaSecretariaPorId(this.graduacaoId).subscribe({
      next: (graduacao) => {
        this.graduacaoForm.patchValue({
          titulo: graduacao.titulo,
          semestres: graduacao.semestres,
          codigoCurso: graduacao.codigoCurso,
          coordenadorDoCursoId: graduacao.coordenadorDoCurso?.id ?? null,
        });
        
        this.graduacaoForm.get('campiSelecionados')?.setValue(graduacao.campusDisponiveis || []);
        
        this.isLoading = false;
        this.isLoadingProfessores = false; 
        this.isLoadingCampi = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados da graduação:', err);
        this.errorMessage = err.message || 'Erro ao carregar dados da graduação.';
        this.isLoading = false;
        this.isLoadingProfessores = false;
        this.isLoadingCampi = false;
      }
    });
  }

  onSubmit(): void {
    if (this.graduacaoForm.invalid) {
      this.graduacaoForm.markAllAsTouched();
      return;
    }
    if (!this.universidadeIdDoUsuario) {
        this.errorMessage = 'ID da universidade do usuário não encontrado. Não é possível salvar.';
        return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    
    const formValue = this.graduacaoForm.value;

    const selectedCampiSubmit = formValue.campiSelecionados || [];

    const graduacaoData: GraduacaoDTO = {
      titulo: formValue.titulo,
      semestres: formValue.semestres,
      codigoCurso: formValue.codigoCurso,
      coordenadorDoCursoId: formValue.coordenadorDoCursoId,
      campusDisponiveis: selectedCampiSubmit
    };

    if (this.isEditMode && this.graduacaoId) {
      this.graduacaoService.atualizar(this.graduacaoId, graduacaoData).subscribe({
        next: () => {
          alert('Graduação atualizada com sucesso!');
          this.router.navigate(['/funcionariosecretaria/graduacoes']); 
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Erro ao atualizar graduação:', err);
          this.errorMessage = err.error?.message || 'Erro ao atualizar graduação. Tente novamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.graduacaoService.criar(graduacaoData).subscribe({
        next: () => {
          alert('Graduação criada com sucesso!');
          this.router.navigate(['/funcionariosecretaria/graduacoes']);
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Erro ao criar graduação:', err);
          this.errorMessage = err.error?.message || 'Erro ao criar graduação. Tente novamente.';
          this.isLoading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/funcionariosecretaria/graduacoes']);
  }
} 