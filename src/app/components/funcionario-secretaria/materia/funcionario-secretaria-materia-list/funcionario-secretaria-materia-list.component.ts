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
  templateUrl: './funcionario-secretaria-materia-list.component.html',
  styleUrls: ['./funcionario-secretaria-materia-list.component.css']
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