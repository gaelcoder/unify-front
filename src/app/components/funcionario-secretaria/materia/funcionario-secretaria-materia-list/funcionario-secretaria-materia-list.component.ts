import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MateriaService } from '../../../../services/materia.service'; // Corrected path
import { Materia } from '../../../../models/materia.model'; // Corrected path
import { Graduacao } from '../../../../models/graduacao.model'; // Added for getGraduacoesTitulos type
import { PaginationService, PaginationConfig } from '../../../../core/services/pagination.service';
import { PaginationControlsComponent } from '../../../../core/components/pagination-controls/pagination-controls.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-funcionario-secretaria-materia-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginationControlsComponent],
  templateUrl: './funcionario-secretaria-materia-list.component.html',
  styleUrls: ['./funcionario-secretaria-materia-list.component.css']
})
export class FuncionarioSecretariaMateriaListComponent implements OnInit, OnDestroy {
  materias: Materia[] = [];
  paginatedMaterias: Materia[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  paginationConfig: PaginationConfig;
  private paginationSubscription: Subscription;

  constructor(
    private materiaService: MateriaService, 
    private router: Router,
    private paginationService: PaginationService
  ) {
    this.paginationConfig = this.paginationService.getDefaultConfig();
    this.paginationSubscription = this.paginationService.getPaginationState().subscribe(state => {
      this.updatePaginatedData();
    });
  }

  ngOnInit(): void {
    this.loadMaterias();
  }

  ngOnDestroy(): void {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

  loadMaterias(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.materiaService.listarMaterias().subscribe({
      next: (data: Materia[]) => {
        this.materias = data;
        this.paginationService.setTotalItems(data.length);
        this.updatePaginatedData();
        this.isLoading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message || 'Erro ao carregar matérias. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  updatePaginatedData(): void {
    this.paginatedMaterias = this.paginationService.getPaginatedData(this.materias);
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