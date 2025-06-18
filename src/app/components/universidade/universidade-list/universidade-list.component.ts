import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UniversidadeService } from '../../../services/universidade.service';
import { Universidade } from '../../../models/universidade.model';
import { NgxMaskPipe } from 'ngx-mask';
import { PaginationService, PaginationConfig, PaginationState } from '../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-universidade-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgxMaskPipe, PaginationControlsComponent],
  template: `
    <div class="container mt-4">
      <div class="pagetitle">
        <h1>Universidades</h1>
        <p class="text-muted">Gerencie as universidades do sistema.</p>
      </div>

      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Lista de Universidades</h5>
          <a routerLink="/universidades/nova" class="btn btn-primary">
            <i class="fas fa-plus me-1"></i> Nova Universidade
          </a>
        </div>

        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Carregando...</span>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

          <div *ngIf="!loading && !error">
            <div *ngIf="paginatedUniversidades.length === 0" class="alert alert-info mb-0" role="alert">
              Nenhuma universidade cadastrada.
            </div>
            <div *ngIf="paginatedUniversidades.length > 0" class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">CNPJ</th>
                    <th scope="col">Sigla</th>
                    <th scope="col">Fundação</th>
                    <th scope="col">Campus</th>
                    <th scope="col">Representante</th>
                    <th scope="col" class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let universidade of paginatedUniversidades">
                    <td>{{ universidade.nome }}</td>
                    <td>{{ universidade.cnpj | mask: '00.000.000/0000-00' }}</td>
                    <td>{{ universidade.sigla }}</td>
                    <td>{{ universidade.dataFundacao | date:'dd/MM/yyyy' }}</td>
                    <td>{{ universidade.campus }}</td>
                    <td>
                      <span *ngIf="universidade.representante; else noRepresentante">
                        {{ universidade.representante.nome }} {{ universidade.representante.sobrenome }}
                      </span>
                      <ng-template #noRepresentante>
                        <span class="text-muted">Nenhum</span>
                      </ng-template>
                    </td>
                    <td class="text-center">
                      <a [routerLink]="['/universidades/editar', universidade.id]" class="btn btn-sm btn-outline-primary me-2">
                        Editar
                      </a>
                      <button (click)="excluirUniversidade(universidade)" class="btn btn-sm btn-outline-danger">
                        Excluir
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination Controls -->
              <app-pagination-controls 
                *ngIf="universidades.length > 0"
                [config]="paginationConfig"
                (pageChange)="onPageChange($event)"
                (pageSizeChange)="onPageSizeChange($event)"
                (showAllToggle)="onShowAllToggle($event)">
              </app-pagination-controls>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './universidade-list.component.css'
})
export class UniversidadeListComponent implements OnInit, OnDestroy {
  universidades: Universidade[] = [];
  paginatedUniversidades: Universidade[] = [];
  loading = true;
  error = '';
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private universidadeService: UniversidadeService,
    private paginationService: PaginationService
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe((state: PaginationState) => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadUniversidades();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadUniversidades(): void {
    this.loading = true;
    this.error = '';
    this.universidadeService.getAll().subscribe({
      next: (data: Universidade[]) => {
        this.universidades = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Erro ao carregar universidades: ' + err.message;
        this.loading = false;
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedUniversidades = this.paginationService.getPaginatedData(this.universidades);
  }

  excluirUniversidade(universidade: Universidade): void {
    if (confirm(`Tem certeza que deseja excluir a universidade ${universidade.nome}?`)) {
      this.universidadeService.delete(universidade.id).subscribe({
        next: () => {
          alert('Universidade excluída com sucesso!');
          this.loadUniversidades();
        },
        error: (err: any) => {
          this.error = 'Erro ao excluir universidade: ' + err.message;
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
