import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TurmaService } from '../../../core/services/turma.service';
import { Turma } from '../../../models/turma.model';
import { PaginationService, PaginationConfig, PaginationState } from '../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-turma-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationControlsComponent],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Turmas</h2>
        <button class="btn btn-primary" (click)="createTurma()">Nova Turma</button>
      </div>

      <table *ngIf="paginatedTurmas.length > 0" class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Matéria</th>
            <th>Professor</th>
            <th>Turno</th>
            <th>Dia da Semana</th>
            <th>Campus</th>
            <th>Alunos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let turma of paginatedTurmas">
            <td>{{ turma.id }}</td>
            <td>{{ turma.materia.titulo }}</td>
            <td>{{ turma.professor.nome }}</td>
            <td>{{ turma.turno }}</td>
            <td>{{ turma.diaSemana }}</td>
            <td>{{ turma.campus }}</td>
            <td>{{ turma.alunos.length }} / {{ turma.limiteAlunos }}</td>
            <td>
              <button class="btn btn-sm btn-info mr-2" (click)="editTurma(turma.id)">Editar</button>
              <button class="btn btn-sm btn-danger" (click)="deleteTurma(turma.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <app-pagination-controls 
        *ngIf="turmas.length > 0"
        [config]="paginationConfig"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (showAllToggle)="onShowAllToggle($event)">
      </app-pagination-controls>

      <div *ngIf="turmas.length === 0" class="alert alert-info">
        Nenhuma turma encontrada.
      </div>
    </div>
  `,
  styles: []
})
export class TurmaListComponent implements OnInit, OnDestroy {
  turmas: Turma[] = [];
  paginatedTurmas: Turma[] = [];
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private turmaService: TurmaService,
    private router: Router,
    private paginationService: PaginationService
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe((state: PaginationState) => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadTurmas();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (data: Turma[]) => {
        this.turmas = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
      },
      error: (error: any) => {
        console.error('Erro ao carregar turmas:', error);
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedTurmas = this.paginationService.getPaginatedData(this.turmas);
  }

  createTurma(): void {
    this.router.navigate(['/funcionariosecretaria/turmas/nova']);
  }

  editTurma(id: number): void {
    this.router.navigate(['/funcionariosecretaria/turmas/editar', id]);
  }

  deleteTurma(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      this.turmaService.deleteTurma(id).subscribe({
        next: () => {
          alert('Turma excluída com sucesso!');
          this.loadTurmas();
        },
        error: (error: any) => {
          console.error('Erro ao excluir turma:', error);
          alert('Erro ao excluir turma.');
        }
      });
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