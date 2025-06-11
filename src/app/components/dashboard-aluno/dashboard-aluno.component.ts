import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GradeHorariaService } from '../../services/grade-horaria.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-aluno',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './dashboard-aluno.component.html',
  styleUrl: './dashboard-aluno.component.css'
})
export class DashboardAlunoComponent {
  
  constructor(
    private authService: AuthService,
    private gradeHorariaService: GradeHorariaService
  ) {}

  gerarGradeHoraria(): void {
    const alunoId = this.authService.currentUserValue?.id;
    if (alunoId) {
      this.gradeHorariaService.gerarGradeHoraria(alunoId).subscribe(
        (data: Blob) => {
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `grade_horaria_${alunoId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        (error: any) => {
          console.error('Erro ao gerar a grade horária', error);
        }
      );
    } else {
      console.error('ID do aluno não encontrado.');
    }
  }

}
