import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../../../services/aluno.service'; // Adjusted path
import { Aluno } from '../../../../models/aluno.model'; // Adjusted path
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
        Erro ao carregar a lista de alunos.
      </div>

      <div *ngIf="isLoading" class="alert alert-info">
        Carregando alunos...
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
                <td>{{ aluno.graduacao?.nome || 'N/A' }}</td>
                <td>
                  <a [routerLink]="['../alunos/editar', aluno.id]" class="btn btn-sm btn-outline-primary me-2">Editar</a>
                  <button (click)="confirmDelete(aluno)" class="btn btn-sm btn-outline-danger">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!alunosList || alunosList.length === 0" class="alert alert-secondary">
            Nenhum aluno encontrado.
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

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.loadAlunos();
  }

  loadAlunos(): void {
    this.isLoading = true;
    this.errorLoadingAlunos = false;
    this.alunos$ = this.alunoService.listarAlunos().pipe(
      tap(() => {
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Erro ao carregar alunos:', err);
        this.errorLoadingAlunos = true;
        this.isLoading = false;
        return of([]); // Return empty array on error to satisfy the async pipe expecting an array
      })
    );
  }

  confirmDelete(aluno: Aluno): void {
    if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome} ${aluno.sobrenome} (Matrícula: ${aluno.matricula})? Esta ação não pode ser desfeita.`)) {
      this.alunoService.deletarAluno(aluno.id).subscribe({
        next: () => {
          alert('Aluno excluído com sucesso!');
          this.loadAlunos(); // Recarrega a lista
        },
        error: (err) => {
          console.error('Erro ao excluir aluno:', err);
          alert('Erro ao excluir aluno. Verifique o console para mais detalhes.');
        }
      });
    }
  }
} 