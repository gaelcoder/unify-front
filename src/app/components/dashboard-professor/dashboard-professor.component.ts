import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProfessorService } from '../../services/professor.service';
import { TurmaDTO } from '../../core/dtos/turma.dto';

@Component({
  selector: 'app-dashboard-professor',
  templateUrl: './dashboard-professor.component.html',
  styleUrls: ['./dashboard-professor.component.css']
})
export class DashboardProfessorComponent implements OnInit {

  minhasTurmas$: Observable<TurmaDTO[] | null> = of(null);
  errorLoadingTurmas: boolean = false;
  nomeProfessor: string = 'Nome do Professor (Carregar dinamicamente)';

  constructor(
    private professorService: ProfessorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.minhasTurmas$ = this.professorService.getMinhasTurmas()
      .pipe(
        catchError(err => {
          console.error('Erro ao buscar turmas do professor:', err);
          this.errorLoadingTurmas = true;
          return of(null);
        })
      );
  }

  navigateToTurma(turmaId: number): void {
    if (turmaId) {
      this.router.navigate(['/professor/turma', turmaId, 'detalhes']);
    } else {
      console.error('ID da turma inválido para navegação.');
    }
  }
}
