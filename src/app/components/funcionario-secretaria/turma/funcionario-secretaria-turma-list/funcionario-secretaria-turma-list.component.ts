import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-turma-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Gerenciar Turmas (Secretaria)</h2>
    <p>Lista de turmas da universidade.</p>
    <a routerLink="../turmas/nova" class="btn btn-primary mb-3">Nova Turma</a>
    <p><em>Funcionalidade de listagem de turmas a ser implementada.</em></p>
    <a routerLink="/dashboard-secretaria" class="btn btn-secondary">Voltar ao Painel</a>
  `,
  styles: []
})
export class FuncionarioSecretariaTurmaListComponent {
  constructor() {}
} 