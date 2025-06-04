import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-materia-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Gerenciar Matérias (Secretaria)</h2>
    <p>Lista de matérias da universidade.</p>
    <a routerLink="../materias/nova" class="btn btn-primary mb-3">Nova Matéria</a>
    <p><em>Funcionalidade de listagem de matérias a ser implementada.</em></p>
    <a routerLink="/dashboard-secretaria" class="btn btn-secondary">Voltar ao Painel</a>
  `,
  styles: []
})
export class FuncionarioSecretariaMateriaListComponent {
  constructor() {}
} 