import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorService, Turma } from '../../services/professor.service';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-dashboard.component.html',
  styleUrls: ['./professor-dashboard.component.css']
})
export class ProfessorDashboardComponent {
  turmas: Turma[] | null = null;

  constructor(private professorService: ProfessorService) { }

  verificarTurmas() {
    this.professorService.getTurmas().subscribe({
      next: (data) => {
        this.turmas = data;
      },
      error: (err) => {
        console.error('Erro ao buscar turmas', err);
      }
    });
  }

  gerarRelatorio(turmaId: number) {
    this.professorService.gerarRelatorio(turmaId).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err) => {
        console.error('Erro ao gerar relatório', err);
      }
    });
  }
} 