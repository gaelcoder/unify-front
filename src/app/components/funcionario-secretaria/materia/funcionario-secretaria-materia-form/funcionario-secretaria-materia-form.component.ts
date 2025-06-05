import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MateriaService } from '../../../../services/materia.service';
import { GraduacaoService } from '../../../../services/graduacao.service';
import { Materia, MateriaDTO } from '../../../../models/materia.model';
import { Graduacao } from '../../../../models/graduacao.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-funcionario-secretaria-materia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>{{ isEditMode ? 'Editar Matéria' : 'Nova Matéria' }} (Secretaria)</h2>

      <div *ngIf="isLoading && !materiaForm" class="alert alert-info">Carregando dados...</div>
      <div *ngIf="errorMessage && !isSubmitting" class="alert alert-danger">{{ errorMessage }}</div>
      <!-- Specific error for submission shown below submit button -->

      <form *ngIf="materiaForm" [formGroup]="materiaForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="titulo" class="form-label">Título da Matéria</label>
          <input type="text" id="titulo" formControlName="titulo" class="form-control"
                 [ngClass]="{ 'is-invalid': materiaForm.get('titulo')?.invalid && materiaForm.get('titulo')?.touched }">
          <div *ngIf="materiaForm.get('titulo')?.invalid && materiaForm.get('titulo')?.touched" class="invalid-feedback">
            Título é obrigatório.
          </div>
        </div>

        <div class="mb-3">
          <label for="codigo" class="form-label">Código da Matéria</label>
          <input type="text" id="codigo" formControlName="codigo" class="form-control"
                 [ngClass]="{ 'is-invalid': materiaForm.get('codigo')?.invalid && materiaForm.get('codigo')?.touched }">
          <div *ngIf="materiaForm.get('codigo')?.invalid && materiaForm.get('codigo')?.touched" class="invalid-feedback">
            Código é obrigatório.
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="creditos" class="form-label">Créditos</label>
            <input type="number" id="creditos" formControlName="creditos" class="form-control"
                   [ngClass]="{ 'is-invalid': materiaForm.get('creditos')?.invalid && materiaForm.get('creditos')?.touched }">
            <div *ngIf="materiaForm.get('creditos')?.invalid && materiaForm.get('creditos')?.touched" class="invalid-feedback">
              Créditos são obrigatórios e devem ser um número positivo.
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="cargaHoraria" class="form-label">Carga Horária (horas)</label>
            <input type="number" id="cargaHoraria" formControlName="cargaHoraria" class="form-control"
                   [ngClass]="{ 'is-invalid': materiaForm.get('cargaHoraria')?.invalid && materiaForm.get('cargaHoraria')?.touched }">
            <div *ngIf="materiaForm.get('cargaHoraria')?.invalid && materiaForm.get('cargaHoraria')?.touched" class="invalid-feedback">
              Carga horária é obrigatória e deve ser um número positivo.
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="creditosNecessarios" class="form-label">Créditos Necessários (para cursar)</label>
          <input type="number" id="creditosNecessarios" formControlName="creditosNecessarios" class="form-control">
           <div *ngIf="materiaForm.get('creditosNecessarios')?.errors?.['min']" class="invalid-feedback">
            Créditos necessários não podem ser negativos.
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Associar Graduações</label>
          <div *ngIf="todasGraduacoes.length === 0 && isLoadingGraduacoes" class="text-muted">Carregando graduações...</div>
          <div *ngIf="todasGraduacoes.length === 0 && !isLoadingGraduacoes && initialDataLoaded && !errorMessageForGraduacoes" class="text-info">Nenhuma graduação disponível para associação. Cadastre graduações primeiro.</div>
          <div *ngIf="errorMessageForGraduacoes" class="text-danger">{{ errorMessageForGraduacoes }}</div>
          
          <select multiple formControlName="graduacaoIds" class="form-control" size="5" 
                  [ngClass]="{ 'is-invalid': materiaForm.get('graduacaoIds')?.invalid && (materiaForm.get('graduacaoIds')?.touched || materiaForm.get('graduacaoIds')?.dirty) }">
            <option *ngFor="let grad of todasGraduacoes" [value]="grad.id">{{ grad.titulo }}</option>
          </select>
          <div *ngIf="materiaForm.get('graduacaoIds')?.errors?.['required'] && (materiaForm.get('graduacaoIds')?.touched || materiaForm.get('graduacaoIds')?.dirty)" class="invalid-feedback">
            É obrigatório associar pelo menos uma graduação.
          </div>
           <small class="form-text text-muted">Segure Ctrl (ou Cmd em Mac) para selecionar múltiplas graduações.</small>
        </div>

        <div class="mt-4">
          <button type="submit" [disabled]="materiaForm.invalid || isSubmitting" class="btn btn-primary me-2">
            <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {{ isEditMode ? 'Salvar Alterações' : 'Criar Matéria' }}
          </button>
          <a routerLink="/funcionariosecretaria/materias" class="btn btn-secondary">Voltar para Lista</a>
        </div>
        <div *ngIf="errorMessage && isSubmitting" class="alert alert-danger mt-3">{{ errorMessage }}</div>

      </form>
    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaMateriaFormComponent implements OnInit {
  materiaForm!: FormGroup;
  isEditMode = false;
  materiaId: number | null = null;
  
  isLoading = false; 
  isLoadingGraduacoes = false; 
  isSubmitting = false; 
  initialDataLoaded = false; 

  errorMessage: string | null = null; // General error message for the form, especially for submit
  errorMessageForGraduacoes: string | null = null; // Specific error for loading graduacoes
  todasGraduacoes: Graduacao[] = [];

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private graduacaoService: GraduacaoService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllGraduacoesForUniversity(); 

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.materiaId = +id;
        // loadMateriaData will set initialDataLoaded after its attempt
    } else {
        this.isEditMode = false;
        // If not in edit mode, initial data loading relies only on graduacoes
        // initialDataLoaded will be set by loadAllGraduacoesForUniversity if it finishes first
        // or if loadMateriaData is not called.
        if (!this.isLoadingGraduacoes) { // If graduacoes already loaded or failed
            this.initialDataLoaded = true;
        }
      }
    });
  }

  initForm(): void {
    this.materiaForm = this.fb.group({
      titulo: ['', Validators.required],
      codigo: ['', Validators.required],
      creditos: [null, [Validators.required, Validators.min(1)]],
      cargaHoraria: [null, [Validators.required, Validators.min(1)]],
      ementa: [''],
      creditosNecessarios: [0, [Validators.nullValidator, Validators.min(0)]], // Allow null, but if not null, min 0
      graduacaoIds: [[], Validators.required]
    });
  }

  loadAllGraduacoesForUniversity(): void {
    this.isLoadingGraduacoes = true;
    this.errorMessageForGraduacoes = null;
    this.graduacaoService.listarGraduacoesParaSecretaria().subscribe({ // Corrected method name call
      next: (graduacoes: Graduacao[]) => { 
        this.todasGraduacoes = graduacoes;
        if (!this.isEditMode && this.materiaId === null) { 
            this.initialDataLoaded = true;
        }
        if (this.isEditMode && this.materiaId !== null && !this.isLoading) { 
            this.initialDataLoaded = true;
        }
      },
      error: (err: Error) => { 
        this.errorMessageForGraduacoes = err.message || 'Erro ao carregar lista de graduações.';
        if (!this.isEditMode && this.materiaId === null) { 
            this.initialDataLoaded = true;
        }
         if (this.isEditMode && this.materiaId !== null && !this.isLoading) { 
            this.initialDataLoaded = true;
        }
      },
      complete: () => {
        this.isLoadingGraduacoes = false;
        // If we are in edit mode, we wait for materia data to also load before setting initialDataLoaded = true
        // If not in edit mode, graduacoes are the only initial async data.
        if(!this.isEditMode){
            this.initialDataLoaded = true;
        }
        // If this is the last one to load in edit mode
        else if (this.isEditMode && !this.isLoading) {
             this.initialDataLoaded = true;
        }

         // If edit mode and materia data is still loading, loadMateriaData will set initialDataLoaded
         if(this.isEditMode && this.materiaId && this.materiaForm.get('titulo')?.value === ''){
            this.loadMateriaData(); // ensure materia data is loaded after graduacoes in edit mode if not already starting
         }
      }
    });
  }

  loadMateriaData(): void {
    if (!this.materiaId) {
        this.initialDataLoaded = true; // Should not happen if called correctly
        return;
    }
    this.isLoading = true;
    this.errorMessage = null; // Clear general form error
    this.materiaService.buscarMateriaPorId(this.materiaId).subscribe({
      next: (materia: Materia) => {
        this.materiaForm.patchValue({
          titulo: materia.titulo,
          codigo: materia.codigo,
          creditos: materia.creditos,
          cargaHoraria: materia.cargaHoraria,
          creditosNecessarios: materia.creditosNecessarios,
          graduacaoIds: materia.graduacoes ? materia.graduacoes.map(g => g.id) : []
        });
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Erro ao carregar dados da matéria.';
      },
      complete: () => {
        this.isLoading = false;
        this.initialDataLoaded = true; // Materia data attempt is complete
      }
    });
  }

  onSubmit(): void {
    if (this.materiaForm.invalid) {
      this.materiaForm.markAllAsTouched(); 
      Object.values(this.materiaForm.controls).forEach(control => {
        control.markAsDirty(); // Ensure dirty status for validation messages that depend on it
      });
      this.errorMessage = "Formulário inválido. Verifique os campos marcados.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formValue = this.materiaForm.value;
    const materiaDto: MateriaDTO = {
      // id: this.isEditMode ? this.materiaId : undefined, // DTO for create usually doesn't have ID
      titulo: formValue.titulo,
      codigo: formValue.codigo,
      creditos: formValue.creditos,
      cargaHoraria: formValue.cargaHoraria,
      creditosNecessarios: formValue.creditosNecessarios === null || formValue.creditosNecessarios === '' ? 0 : formValue.creditosNecessarios,
      graduacaoIds: formValue.graduacaoIds || [] 
    };

    const operation: Observable<Materia> = this.isEditMode && this.materiaId 
      ? this.materiaService.atualizarMateria(this.materiaId, materiaDto)
      : this.materiaService.criarMateria(materiaDto);

    operation.subscribe({
      next: () => {
        alert(`Matéria ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
        this.router.navigate(['/funcionariosecretaria/materias']); 
      },
      error: (err: Error) => {
        this.errorMessage = err.message || `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} matéria.`;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
} 