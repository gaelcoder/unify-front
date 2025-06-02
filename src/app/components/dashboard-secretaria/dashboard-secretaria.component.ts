import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SecretariaService } from '../../services/secretaria.service';
import { SecretariaDashboardStatsDTO } from '../../core/dtos/secretaria-dashboard-stats.dto';

@Component({
  selector: 'app-dashboard-secretaria',
  templateUrl: './dashboard-secretaria.component.html',
  styleUrls: ['./dashboard-secretaria.component.css']
})
export class DashboardSecretariaComponent implements OnInit {

  dashboardStats$: Observable<SecretariaDashboardStatsDTO | null> = of(null);
  errorLoadingStats: boolean = false;

  nomeUniversidade: string = 'Nome da Universidade (Carregar dinamicamente se necessário)';

  constructor(private secretariaService: SecretariaService) { }

  ngOnInit(): void {
    this.dashboardStats$ = this.secretariaService.getDashboardStats()
      .pipe(
        catchError(err => {
          console.error('Erro ao buscar estatísticas do dashboard da secretaria:', err);
          this.errorLoadingStats = true;
          return of(null);
        })
      );
  }

  navigateTo(route: string): void {
    console.log(`Secretaria navegando para: ${route}`);
  }
}
