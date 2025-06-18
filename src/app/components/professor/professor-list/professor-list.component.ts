import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfessorService } from '../../../services/professor.service';
import { Professor } from '../../../models/professor.model';
import { PaginationService, PaginationConfig, PaginationState } from '../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service'; // For potential UI changes based on role

@Component({
  selector: 'app-professor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationControlsComponent],
  template: `
    <main class="container mt-5">
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Professores</h2>
        <button type="button" (click)="navigateToNovoProfessor()" class="btn btn-primary">Novo Professor</button>
      </header>

      <div *ngIf="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div *ngIf="loading" class="text-center" role="status">
        <div class="spinner-border">
          <span class="visually-hidden">Carregando...</span>
        </div>
      </div>

      <section *ngIf="!loading && !error" class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Email Institucional</th>
              <th>Titulação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let professor of paginatedProfessores">
              <td>{{ professor.nome }} {{ professor.sobrenome }}</td>
              <td>{{ professor.email || professor.email }}</td>
              <td>{{ professor.titulacao }}</td>
              <td>
                <button type="button" (click)="editarProfessor(professor)" class="btn btn-sm btn-primary me-2">
                  Editar
                </button>
                <button type="button" (click)="excluirProfessor(professor.id)" class="btn btn-sm btn-danger">
                  Excluir
                </button>
              </td>
            </tr>
            <tr *ngIf="paginatedProfessores.length === 0 && !loading">
              <td colspan="5" class="text-center">Nenhum professor encontrado.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <app-pagination-controls 
          *ngIf="professores.length > 0"
          [config]="paginationConfig"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
          (showAllToggle)="onShowAllToggle($event)">
        </app-pagination-controls>
      </section>
    </main>
  `,
  styles: []
})
export class ProfessorListComponent implements OnInit, OnDestroy {
  professores: Professor[] = [];
  paginatedProfessores: Professor[] = [];
  loading = true;
  error = '';
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private professorService: ProfessorService,
    private router: Router,
    private paginationService: PaginationService,
    public authService: AuthService // Make public if used in template
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe((state: PaginationState) => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadProfessores();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadProfessores(): void {
    this.loading = true;
    this.error = '';
    this.professorService.listarProfessores().subscribe({
      next: (data) => {
        this.professores = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar professores: ' + err.message;
        this.loading = false;
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedProfessores = this.paginationService.getPaginatedData(this.professores);
  }

  navigateToNovoProfessor(): void {
    this.router.navigate(['/professores/novo']);
  }

  editarProfessor(professor: Professor): void {
    this.router.navigate(['/professores/editar', professor.id]);
  }

  excluirProfessor(id: number): void {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      this.professorService.delete(id).subscribe({
        next: () => {
          alert('Professor excluído com sucesso!');
          this.loadProfessores();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir professor: ' + err.message;
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