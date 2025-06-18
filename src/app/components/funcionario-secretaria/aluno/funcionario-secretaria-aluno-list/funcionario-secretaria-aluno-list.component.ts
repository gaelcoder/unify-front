import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../../../services/aluno.service';
import { Aluno } from '../../../../models/aluno.model';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay, map } from 'rxjs/operators';
import { PaginationService, PaginationConfig } from '../../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-funcionario-secretaria-aluno-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationControlsComponent],
  template: `
    <div class="container mt-4">
      <h2>Gerenciar Alunos (Secretaria)</h2>
      <p>Lista de alunos da universidade.</p>
      <a routerLink="../alunos/novo" class="btn btn-primary mb-3">Novo Aluno</a>

      <div *ngIf="errorLoadingAlunos && !isLoading" class="alert alert-danger">
        Erro ao carregar a lista de alunos. (Service Call)
      </div>

      <div *ngIf="isLoading" class="alert alert-info">
        Carregando alunos... (Service Call)
      </div>

      <ng-container *ngIf="!isLoading && !errorLoadingAlunos">
        <ng-container *ngIf="paginatedAlunos$ | async as alunosList">
          <table *ngIf="alunosList && alunosList.length > 0" class="table table-striped">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome Completo</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Graduação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let aluno of alunosList">
                <td>{{ aluno.matricula }}</td>
                <td>{{ aluno.nome }} {{ aluno.sobrenome }}</td>
                <td>{{ aluno.email }}</td>
                <td>{{ aluno.cpf }}</td>
                <td>{{ aluno.graduacao?.titulo || 'N/A' }}</td>
                <td>
                  <a [routerLink]="['../alunos/editar', aluno.id]" class="btn btn-sm btn-outline-primary me-2">Editar</a>
                  <button (click)="confirmDelete(aluno)" class="btn btn-sm btn-outline-danger">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Pagination Controls -->
          <app-pagination-controls 
            *ngIf="alunos && alunos.length > 0"
            [config]="paginationConfig"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
            (showAllToggle)="onShowAllToggle($event)">
          </app-pagination-controls>
          
          <div *ngIf="!alunosList || alunosList.length === 0" class="alert alert-secondary">
            Nenhum aluno encontrado. (Service Call)
          </div>
        </ng-container>
      </ng-container>

    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaAlunoListComponent implements OnInit, OnDestroy {
  alunos$: Observable<any[]> = of([]);
  paginatedAlunos$: Observable<any[]> = of([]);
  alunos: any[] = [];
  isLoading = true;
  errorLoadingAlunos = false;
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private alunoService: AlunoService,
    private paginationService: PaginationService
  ) {
    console.log('[AlunoListComponent] Constructor called');
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe(state => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    console.log('[AlunoListComponent] ngOnInit called');
    this.loadAlunosViaService();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadAlunosViaService(): void {
    console.log('[AlunoListComponent] loadAlunosViaService called');
    this.isLoading = true;
    this.errorLoadingAlunos = false;
    console.log('[AlunoListComponent] Calling alunoService.listarAlunos()...');
    this.alunos$ = this.alunoService.listarAlunos().pipe(
      tap((data) => {
        console.log('[AlunoListComponent] listarAlunos (service) observable emitted (tap), Data:', data);
        this.alunos = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('[AlunoListComponent] Erro ao carregar alunos (service call catchError):', err);
        this.errorLoadingAlunos = true;
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1)
    );

    this.alunos$.subscribe({
      // No specific logic needed here as tap/catchError handle side-effects
    });
    console.log('[AlunoListComponent] alumnos$ (service call) prepared with shareReplay and subscribed to trigger.');
  }

  updatePaginatedData(): void {
    this.paginatedAlunos$ = of(this.paginationService.getPaginatedData(this.alunos));
  }

  confirmDelete(aluno: any): void {
    if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome} ${aluno.sobrenome}?`)) {
      // Implement delete logic here
      console.log('Deleting aluno:', aluno.id);
    }
  }

  onPageChange(page: number): void {
    // Handled by the pagination service
  }

  onPageSizeChange(pageSize: number): void {
    // Handled by the pagination service
  }

  onShowAllToggle(showAll: boolean): void {
    // Handled by the pagination service
  }
} 