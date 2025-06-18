import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GraduacaoService } from '../../../../services/graduacao.service';
import { Graduacao } from '../../../../models/graduacao.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationService, PaginationConfig } from '../../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-funcionario-secretaria-graduacao-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationControlsComponent],
  template: `
    <div class="container-xl mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Gerenciar Graduações</h2>
        <a routerLink="../graduacoes/novo" class="btn btn-primary">Nova Graduação</a>
      </div>

      <div *ngIf="isLoading" class="alert alert-info">Carregando graduações...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <table *ngIf="!isLoading && !error && paginatedGraduacoes.length > 0" class="table table-striped table-hover">
        <thead>
          <tr>
            <th class="align-middle">ID</th>
            <th class="align-middle">Título</th>
            <th class="align-middle">Semestres</th>
            <th class="align-middle">Código do Curso</th>
            <th class="align-middle">Coordenador</th>
            <th class="align-middle">Campi Disponíveis</th>
            <th class="align-middle">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let graduacao of paginatedGraduacoes">
            <td class="align-middle">{{ graduacao.id }}</td>
            <td class="align-middle">{{ graduacao.titulo }}</td>
            <td class="align-middle">{{ graduacao.semestres }}</td>
            <td class="align-middle">{{ graduacao.codigoCurso }}</td>
            <td class="align-middle">{{ graduacao.coordenadorDoCurso?.nome || 'N/A' }}</td>
            <td class="align-middle">{{ graduacao.campusDisponiveis?.join(', ') || 'N/A' }}</td>
            <td class="align-middle">
              <a [routerLink]="['../graduacoes/editar', graduacao.id]" class="btn btn-sm btn-outline-primary me-2">
                <i class="fas fa-edit me-1"></i> Editar
              </a>
              <button (click)="deletarGraduacao(graduacao.id)" class="btn btn-sm btn-outline-danger">
                <i class="fas fa-trash-alt me-1"></i> Deletar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <app-pagination-controls 
        *ngIf="!isLoading && !error && graduacoes.length > 0"
        [config]="paginationConfig"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (showAllToggle)="onShowAllToggle($event)">
      </app-pagination-controls>

      <div *ngIf="!isLoading && !error && graduacoes.length === 0" class="alert alert-warning">
        Nenhuma graduação encontrada.
      </div>

      <a routerLink="/dashboard-secretaria" class="btn btn-secondary mt-3">Voltar ao Painel</a>
    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaGraduacaoListComponent implements OnInit, OnDestroy {
  graduacoes: Graduacao[] = [];
  paginatedGraduacoes: Graduacao[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private graduacaoService: GraduacaoService,
    private paginationService: PaginationService
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe(state => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadGraduacoes();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadGraduacoes(): void {
    this.isLoading = true;
    this.error = null;
    this.graduacaoService.listarTodas().subscribe({
      next: (data) => {
        const normalizedData = data.map((item, index) => {
          const newItem = {
            id: item.id,
            titulo: item.titulo,
            semestres: item.semestres,
            codigoCurso: item.codigoCurso,
            universidade: item.universidade,
            coordenadorDoCurso: item.coordenadorDoCurso,
            materias: item.materias,
            alunos: item.alunos,
            campusDisponiveis: item.campusDisponiveis
          };
          
          if (newItem.campusDisponiveis === undefined && item.campusDisponiveis !== null) {
            try {
              const stringifiedItem = JSON.stringify(item);
              const parsedFallback = JSON.parse(stringifiedItem);

              let foundCampusData = false;
              for (const key in parsedFallback) {
                if (parsedFallback.hasOwnProperty(key)) {
                  if (key.toLowerCase().includes('campus')) {
                    if (Array.isArray(parsedFallback[key])) {
                      newItem.campusDisponiveis = parsedFallback[key];
                      foundCampusData = true;
                      break; 
                    }
                  }
                }
              }
              if (!foundCampusData) {
              }
            } catch (e) {
            }
          }
          return newItem;
        });

        this.graduacoes = normalizedData;
        this.paginationService.setTotalItems(normalizedData.length);
        this.updatePaginatedData();

        if (this.graduacoes && this.graduacoes.length > 0) {
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar graduações:', err);
        this.error = `Erro ao carregar graduações: ${err.statusText || 'Erro desconhecido'}. Detalhes: ${err.error?.message || err.message}`;
        this.isLoading = false;
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedGraduacoes = this.paginationService.getPaginatedData(this.graduacoes);
  }

  deletarGraduacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta graduação?')) {
      this.graduacaoService.deletar(id).subscribe({
        next: () => {
          alert('Graduação excluída com sucesso!');
          this.loadGraduacoes();
        },
        error: (err: HttpErrorResponse) => {
          this.error = `Erro ao excluir graduação: ${err.statusText || 'Erro desconhecido'}`;
          alert(this.error);
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