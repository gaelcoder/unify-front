import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FuncionarioService } from '../../services/funcionario.service';
import { ProfessorService } from '../../services/professor.service';
import { Funcionario } from '../../models/funcionario.model';
import { Professor } from '../../models/professor.model';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-funcionario-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './funcionario-rh-dashboard.component.html'
})
export class FuncionarioRHDashboardComponent implements OnInit {
  totalGastosMensais: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  universidadeNome: string | null = null; // Placeholder, might get from user or services

  constructor(
    private funcionarioService: FuncionarioService,
    private professorService: ProfessorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin([
      this.funcionarioService.listarTodosPorUniversidade().pipe(catchError(err => of([] as Funcionario[]))),
      this.professorService.listarTodosPorUniversidade().pipe(catchError(err => of([] as Professor[])))
    ]).pipe(
      map(([funcionarios, professores]: [Funcionario[], Professor[]]) => {
        let totalSalariosFuncionarios = 0;
        if (funcionarios && funcionarios.length > 0) {
          totalSalariosFuncionarios = funcionarios.reduce((sum: number, func: Funcionario) => sum + (func.salario || 0), 0);
          // Assuming a way to get university name, for now, just using the first employee if available
          if (!this.universidadeNome && funcionarios[0]?.universidade?.nome) {
            this.universidadeNome = funcionarios[0].universidade.nome;
          }
        }

        let totalSalariosProfessores = 0;
        if (professores && professores.length > 0) {
          totalSalariosProfessores = professores.reduce((sum: number, prof: Professor) => sum + (prof.salario || 0), 0);
           // Currently, professor model doesn't have direct university name, only universidadeId
           // This part can be enhanced if needed by fetching university details based on universidadeId
        }
        return totalSalariosFuncionarios + totalSalariosProfessores;
      })
    ).subscribe(
      (total: number) => {
        this.totalGastosMensais = total;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.errorMessage = 'Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    );
  }

  navigateToFuncionarios(): void {
    this.router.navigate(['/admin-universidade/funcionarios']);
  }

  navigateToProfessores(): void {
    this.router.navigate(['/admin-universidade/professores']);
  }
} 