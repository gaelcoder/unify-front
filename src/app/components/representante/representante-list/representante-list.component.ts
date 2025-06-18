import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RepresentanteService } from '../../../services/representante.service';
import { Representante } from '../../../models/representante.model';
import { NgxMaskPipe } from 'ngx-mask';
import { PaginationService, PaginationConfig, PaginationState } from '../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-representante-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxMaskPipe, PaginationControlsComponent],
  template: `
    <div class="container mt-4">
      <div class="pagetitle">
        <h1>Representantes</h1>
        <p class="text-muted">Gerencie os representantes das universidades.</p>
      </div>

      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Lista de Representantes</h5>
          <a routerLink="/representantes/novo" class="btn btn-primary">
            <i class="fas fa-plus me-1"></i> Novo Representante
          </a>
        </div>

        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

          <div *ngIf="!loading && !error" class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">CPF</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Cargo</th>
                  <th scope="col" class="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let representante of paginatedRepresentantes">
                  <td>{{ representante.nome }} {{ representante.sobrenome }}</td>
                  <td>{{ representante.cpf | mask: '000.000.000-00' }}</td>
                  <td>{{ representante.email }}</td>
                  <td>{{ representante.telefone | mask: '(00) 00000-0000' }}</td>
                  <td>{{ representante.cargo }}</td>
                  <td class="text-center">
                    <a [routerLink]="['/representantes/editar', representante.id]" class="btn btn-sm btn-outline-primary me-2">
                      Editar
                    </a>
                    <button (click)="excluirRepresentante(representante)" class="btn btn-sm btn-outline-danger" [disabled]="representante.universidade">
                      Excluir
                    </button>
                  </td>
                </tr>
                <tr *ngIf="paginatedRepresentantes.length === 0">
                  <td colspan="6" class="text-center text-muted py-3">Nenhum representante encontrado.</td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <app-pagination-controls 
              *ngIf="representantes.length > 0"
              [config]="paginationConfig"
              (pageChange)="onPageChange($event)"
              (pageSizeChange)="onPageSizeChange($event)"
              (showAllToggle)="onShowAllToggle($event)">
            </app-pagination-controls>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./representante-list.component.css']
})
export class RepresentanteListComponent implements OnInit, OnDestroy {
  representantes: Representante[] = [];
  paginatedRepresentantes: Representante[] = [];
  loading = true;
  error = '';
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private representanteService: RepresentanteService,
    private paginationService: PaginationService
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe((state: PaginationState) => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadRepresentantes();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadRepresentantes(): void {
    this.loading = true;
    this.error = '';
    this.representanteService.listarTodos().subscribe({
      next: (data: Representante[]) => {
        this.representantes = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar representantes: ' + err.message;
        this.loading = false;
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedRepresentantes = this.paginationService.getPaginatedData(this.representantes);
  }

  excluirRepresentante(representante: Representante): void {
    if (representante.universidade) {
      alert('Não é possível excluir um representante que está associado a uma universidade.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o representante ${representante.nome} ${representante.sobrenome}?`)) {
      this.representanteService.excluir(representante.id).subscribe({
        next: () => {
          alert('Representante excluído com sucesso!');
          this.loadRepresentantes();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir representante: ' + err.message;
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
