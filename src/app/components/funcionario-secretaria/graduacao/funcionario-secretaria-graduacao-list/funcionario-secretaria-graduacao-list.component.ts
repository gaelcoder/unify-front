import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-graduacao-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Gerenciar Graduações (Secretaria)</h2>
    <p>Lista de graduações da universidade.</p>
    <a routerLink="../graduacoes/novo" class="btn btn-primary mb-3">Nova Graduação</a>
    <p><em>Funcionalidade de listagem de graduações a ser implementada.</em></p>
    <a routerLink="/dashboard-secretaria" class="btn btn-secondary">Voltar ao Painel</a>
  `,
  styles: []
})
export class FuncionarioSecretariaGraduacaoListComponent {
  constructor() {}
} 