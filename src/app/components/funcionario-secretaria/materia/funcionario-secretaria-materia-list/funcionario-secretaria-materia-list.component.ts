import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MateriaService } from '../../../../services/materia.service'; // Corrected path
import { Materia } from '../../../../models/materia.model'; // Corrected path
import { Graduacao } from '../../../../models/graduacao.model'; // Added for getGraduacoesTitulos type

@Component({
  selector: 'app-funcionario-secretaria-materia-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
    <h2>Gerenciar Matérias (Secretaria)</h2>
      <p>Lista de matérias cadastradas para a universidade.</p>
    <a routerLink="../materias/nova" class="btn btn-primary mb-3">Nova Matéria</a>

      <div *ngIf="isLoading" class="alert alert-info">Carregando matérias...</div>
      <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <table *ngIf="!isLoading && !errorMessage && materias.length > 0" class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Código</th>
            <th>Créditos</th>
            <th>Carga Horária</th>
            <th>Graduações Associadas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let materia of materias">
            <td>{{ materia.id }}</td>
            <td>{{ materia.titulo }}</td>
            <td>{{ materia.codigo }}</td>
            <td>{{ materia.creditos }}</td>
            <td>{{ materia.cargaHoraria }}h</td>
            <td>
              <span *ngIf="materia.graduacoes && materia.graduacoes.length > 0; else noGraduacoes">
                {{ getGraduacoesTitulos(materia.graduacoes) }}
              </span>
              <ng-template #noGraduacoes>Nenhuma</ng-template>
            </td>
            <td>
              <button (click)="navigateToEdit(materia.id)" class="btn btn-sm btn-outline-primary me-2">Editar</button>
              <button (click)="confirmDelete(materia)" class="btn btn-sm btn-outline-danger">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!isLoading && !errorMessage && materias.length === 0" class="alert alert-secondary">
        Nenhuma matéria encontrada.
      </div>

      <a routerLink="/dashboard-secretaria" class="btn btn-secondary mt-3">Voltar ao Painel</a>
    </div>
  `,
  styles: []
})
export class FuncionarioSecretariaMateriaListComponent implements OnInit {
  materias: Materia[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private materiaService: MateriaService, private router: Router) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.materiaService.listarMaterias().subscribe({
      next: (data: Materia[]) => { // Added type for data
        this.materias = data;
        this.isLoading = false;
      },
      error: (err: Error) => { // Added type for err
        this.errorMessage = err.message || 'Erro ao carregar matérias. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  getGraduacoesTitulos(graduacoes: Graduacao[] | undefined): string { // Used Graduacao[] from import
    if (!graduacoes || graduacoes.length === 0) {
      return 'Nenhuma';
    }
    return graduacoes.map(g => g.titulo).join(', ');
  }

  navigateToEdit(id: number): void {
    // Using a more direct path, assuming base route is for `funcionariosecretaria`
    this.router.navigate(['/funcionariosecretaria/materias/editar', id]);
  }

  confirmDelete(materia: Materia): void {
    if (confirm(`Tem certeza que deseja excluir a matéria "${materia.titulo}" (ID: ${materia.id})? Esta ação não pode ser desfeita.`)) {
      this.materiaService.deletarMateria(materia.id).subscribe({
        next: () => {
          alert('Matéria excluída com sucesso!');
          this.loadMaterias(); // Recarrega a lista
        },
        error: (err: Error) => { // Added type for err
          this.errorMessage = err.message || 'Erro ao excluir matéria. Verifique se não há turmas associadas ou outros vínculos.';
          alert(this.errorMessage); // Also show error in an alert for immediate feedback
        }
      });
    }
  }
} 