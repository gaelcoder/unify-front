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

        <div class="mb-3">
          <label class="form-label">Campi Disponíveis (Opcional)</label>
          <div *ngIf="isLoadingCampi" class="form-text">Carregando campi...</div>
          <div *ngIf="!isLoadingCampi && campiDaUniversidade.length === 0" class="form-text">Nenhum campus configurado para esta universidade.</div>
          <div formArrayName="campiDisponiveis" class="list-group">
            <label *ngFor="let control of campiDisponiveisArrayControls; let i = index" class="list-group-item">
              <input type="checkbox" [formControlName]="i" class="form-check-input me-2"> {{ campiDaUniversidade[i] }}
            </label>
          </div>
        </div>

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

  get campiDisponiveisArrayControls() {
    return (this.graduacaoForm.get('campiDisponiveis') as FormArray).controls;
  }

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
    this.loadRelatedData();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.graduacaoId = +idParam;
      this.loadGraduacaoData();
    } else {
      this.isEditMode = false;
    }
  }

  initForm(): void {
    this.graduacaoForm = this.fb.group({
      titulo: ['', Validators.required],
      semestres: [null, [Validators.required, Validators.min(1)]],
      codigoCurso: ['', Validators.required],
      coordenadorDoCursoId: [null],
      campiDisponiveis: this.fb.array([])
    });
  }

  createCampusCheckboxes(campiFromGraduacao?: string[]): void {
    console.log('[Debug] createCampusCheckboxes called. campiDaUniversidade:', this.campiDaUniversidade, 'campiFromGraduacao:', campiFromGraduacao);
    const campiFormArray = this.graduacaoForm.get('campiDisponiveis') as FormArray;
    campiFormArray.clear();
    this.campiDaUniversidade.forEach(campusName => {
      const isSelected = campiFromGraduacao ? campiFromGraduacao.includes(campusName) : false;
      campiFormArray.push(this.fb.control(isSelected));
    });
    console.log('[Debug] createCampusCheckboxes - FormArray controls count after population:', campiFormArray.length);
  }

  loadRelatedData(): void {
    if (!this.universidadeIdDoUsuario) {
      this.errorMessage = 'Não foi possível identificar a universidade do usuário.';
      return;
    }
    this.isLoadingProfessores = true;
    this.isLoadingCampi = true;

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
        if (results.universidade && results.universidade.campus) {
          this.campiDaUniversidade = results.universidade.campus;
        } else {
          this.campiDaUniversidade = [];
        }
        console.log('[Debug] loadRelatedData - campiDaUniversidade set to:', this.campiDaUniversidade);
        if (!this.isEditMode) {
            this.createCampusCheckboxes();
        }
        this.isLoadingProfessores = false;
        this.isLoadingCampi = false;
      },
      error: () => {
        this.isLoadingProfessores = false;
        this.isLoadingCampi = false;
      }
    });
  }

  loadGraduacaoData(): void {
    if (!this.graduacaoId) return;
    this.isLoading = true;
    this.graduacaoService.buscarPorId(this.graduacaoId).subscribe({
      next: (graduacao) => {
        this.graduacaoForm.patchValue({
          titulo: graduacao.titulo,
          semestres: graduacao.semestres,
          codigoCurso: graduacao.codigoCurso,
          coordenadorDoCursoId: graduacao.coordenadorDoCurso?.id
        });
        this.createCampusCheckboxes(graduacao.campiDisponiveis);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar dados da graduação:', err);
        this.errorMessage = 'Erro ao carregar dados da graduação.';
        this.isLoading = false;
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
    console.log("Form Value on Submit:", formValue);
    console.log("Campi Disponiveis from Form:", formValue.campiDisponiveis);

    const selectedCampi = this.graduacaoForm.value.campiDisponiveis
      .map((checked: boolean, i: number) => checked ? this.campiDaUniversidade[i] : null)
      .filter((value: string | null) => value !== null);
    
    console.log("Selected Campi to be sent:", selectedCampi);

    const graduacaoData: GraduacaoDTO = {
      titulo: formValue.titulo,
      semestres: formValue.semestres,
      codigoCurso: formValue.codigoCurso,
      coordenadorDoCursoId: formValue.coordenadorDoCursoId,
      campiDisponiveis: selectedCampi
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