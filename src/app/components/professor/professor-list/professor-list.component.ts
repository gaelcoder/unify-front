import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfessorService } from '../../../services/professor.service';
import { Professor } from '../../../models/professor.model';
import { AuthService } from '../../../services/auth.service'; // For potential UI changes based on role

@Component({
  selector: 'app-professor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.css']
})
export class ProfessorListComponent implements OnInit {
  professores: Professor[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private professorService: ProfessorService,
    private router: Router,
    public authService: AuthService // Make public if used in template
  ) { }

  ngOnInit(): void {
    this.loadProfessores();
  }

  loadProfessores(): void {
    this.loading = true;
    this.error = null;
    this.professorService.listarTodosPorUniversidade().subscribe(
      data => {
        this.professores = data;
        this.loading = false;
      },
      err => {
        this.error = 'Erro ao carregar lista de professores.';
        console.error(err);
        this.loading = false;
      }
    );
  }

  navigateToNovoProfessor(): void {
    this.router.navigate(['/admin-universidade/professores/novo']); // Adjust as per final route structure
  }

  editarProfessor(professor: Professor): void {
    this.router.navigate(['/admin-universidade/professores/editar', professor.id]); // Adjust as per final route structure
  }

  excluirProfessor(id: number): void {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      this.professorService.delete(id).subscribe(
        () => {
          this.loadProfessores(); // Refresh the list
        },
        err => {
          this.error = 'Erro ao excluir professor.';
          console.error(err);
          // Potentially display a more user-friendly error message
        }
      );
    }
  }
} 