import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { SolicitacaoSecretariaDTO, StatusSolicitacao } from '../../../models/solicitacao.model';
import { UniversidadeService } from '../../../services/universidade.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-solicitacoes-secretaria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitacoes-secretaria-list.component.html',
  styleUrls: ['./solicitacoes-secretaria-list.component.css']
})
export class SolicitacoesSecretariaListComponent implements OnInit {
  solicitacoes: SolicitacaoSecretariaDTO[] = [];
  filteredSolicitacoes: SolicitacaoSecretariaDTO[] = [];
  campi: string[] = [];
  selectedCampus: string | undefined;
  selectedStatus: StatusSolicitacao = StatusSolicitacao.ABERTA;
  statusOptions = Object.values(StatusSolicitacao);
  isLoading = false;
  error: string | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private universidadeService: UniversidadeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCampi();
    this.loadSolicitacoes();
  }

  loadCampi(): void {
    const universidadeId = this.authService.getUniversidadeId();
    if (universidadeId) {
      this.universidadeService.getCampi(universidadeId).subscribe({
        next: (campi) => this.campi = campi,
        error: () => this.error = 'Falha ao carregar os campi.'
      });
    }
  }

  loadSolicitacoes(): void {
    this.isLoading = true;
    this.error = null;
    this.solicitacaoService.getSolicitacoesParaSecretaria(this.selectedStatus, this.selectedCampus)
      .subscribe({
        next: (data) => {
          this.solicitacoes = data;
          this.filteredSolicitacoes = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Falha ao carregar as solicitações. ' + err.message;
          this.isLoading = false;
        }
      });
  }

  filterSolicitacoes(): void {
    this.loadSolicitacoes();
  }

  onFilterChange(): void {
    this.loadSolicitacoes();
  }

  aprovar(id: number): void {
    this.updateStatus(id, StatusSolicitacao.CONCLUIDA);
  }

  rejeitar(id: number): void {
    this.updateStatus(id, StatusSolicitacao.REJEITADA);
  }

  private updateStatus(id: number, status: StatusSolicitacao): void {
    this.solicitacaoService.updateSolicitacaoStatus(id, { status }).subscribe({
      next: () => {
        this.loadSolicitacoes(); // Reload data to reflect changes
      },
      error: (err) => this.error = 'Falha ao atualizar o status. ' + err.message
    });
  }
}
