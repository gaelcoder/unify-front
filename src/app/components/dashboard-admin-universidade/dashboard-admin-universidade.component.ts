import { Component, OnInit } from '@angular/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UniversidadeService } from '../../services/universidade.service';
import { UniversidadeStatsDTO } from '../../models/universidade-stats.model';

@Component({
  selector: 'app-dashboard-admin-universidade',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin-universidade.component.html',
  styleUrls: ['./dashboard-admin-universidade.component.css']
})
export class AdminUniversidadeDashboardComponent implements OnInit {
  stats: UniversidadeStatsDTO | null = null;
  loadingStats: boolean = true;
  statsError: string | null = null;

  constructor(
    private universidadeService: UniversidadeService
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;
    this.statsError = null;
    this.universidadeService.getMinhaUniversidadeStats()
      .pipe(
        tap(data => {
          this.stats = data;
        }),
        catchError(error => {
          console.error('Erro ao buscar estatísticas da universidade:', error);
          this.statsError = 'Não foi possível carregar as estatísticas da universidade. Tente novamente mais tarde.';
          return of(null);
        }),
        finalize(() => {
          this.loadingStats = false;
        })
      )
      .subscribe();
  }

  get universidadeNome(): string {
    return this.stats?.universidadeNome || 'Universidade';
  }
} 