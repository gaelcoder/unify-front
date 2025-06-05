import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../../../services/aluno.service';
import { Aluno } from '../../../../models/aluno.model';
import { Observable, of } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-funcionario-secretaria-aluno-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
        <ng-container *ngIf="alunos$ | async as alunosList">
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
          <div *ngIf="!alunosList || alunosList.length === 0" class="alert alert-secondary">
            Nenhum aluno encontrado. (Service Call)
          </div>
        </ng-container>
      </ng-container>

    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaAlunoListComponent implements OnInit {
  alunos$: Observable<Aluno[]> = of([]);
  isLoading = true;
  errorLoadingAlunos = false;

  constructor(private alunoService: AlunoService) {
    console.log('[AlunoListComponent] Constructor called');
  }

  ngOnInit(): void {
    console.log('[AlunoListComponent] ngOnInit called');
    this.loadAlunosViaService();
  }

  loadAlunosViaService(): void {
    console.log('[AlunoListComponent] loadAlunosViaService called');
    this.isLoading = true;
    this.errorLoadingAlunos = false;
    console.log('[AlunoListComponent] Calling alunoService.listarAlunos()...');
    this.alunos$ = this.alunoService.listarAlunos().pipe(
      tap((data) => {
        console.log('[AlunoListComponent] listarAlunos (service) observable emitted (tap), Data:', data);
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('[AlunoListComponent] Erro ao carregar alunos (service call catchError):', err);
        this.errorLoadingAlunos = true;
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1) // Share the last emission and replay for new subscribers
    );

    // Explicitly subscribe to trigger the observable chain and update loading states.
    // The async pipe in the template will use the replayed value.
    this.alunos$.subscribe({
      // No specific logic needed here as tap/catchError handle side-effects (isLoading, errorLoadingAlunos)
      // and the async pipe handles rendering. This subscription is just to kick off the stream.
    });
    console.log('[AlunoListComponent] alumnos$ (service call) prepared with shareReplay and subscribed to trigger.');
  }

  confirmDelete(aluno: Aluno): void {
    if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome} ${aluno.sobrenome} (Matrícula: ${aluno.matricula})? Esta ação não pode ser desfeita.`)) {
      this.alunoService.deletarAluno(aluno.id).subscribe({
        next: () => {
          alert('Aluno excluído com sucesso!');
          this.loadAlunosViaService(); // Recarrega a lista via service
        },
        error: (err) => {
          console.error('Erro ao excluir aluno:', err);
          alert('Erro ao excluir aluno. Verifique o console para mais detalhes.');
        }
      });
    }
  }
} 