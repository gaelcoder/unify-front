import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-solicitacoes-troca-turma-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Solicitações de Troca de Turma (Secretaria)</h2>
    <p>Lista de solicitações de troca de turma pendentes.</p>
    <p><em>Funcionalidade de listagem e processamento de solicitações a ser implementada.</em></p>
    <a routerLink="/dashboard-secretaria" class="btn btn-secondary">Voltar ao Painel</a>
  `,
  styles: []
})
export class FuncionarioSecretariaSolicitacoesTrocaTurmaListComponent {
  constructor() {}
} 