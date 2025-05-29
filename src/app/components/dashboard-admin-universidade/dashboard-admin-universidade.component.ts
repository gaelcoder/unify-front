import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Temporary
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

// Interface for the expected stats from /api/admin-universidade/minha-universidade/stats
export interface UniversidadeStatsDTO {
  universidadeNome: string;
  universidadeId: number;
  campusCount: number;
  funcionariosCount: number;
  alunosCount: number;
}

// Placeholder service - replace with actual service later
// @Injectable({ providedIn: 'root' })
// export class AdminUniversidadeService {
//   private apiUrl = '/api/admin-universidade';
//   constructor(private http: HttpClient) { }
//   getMinhaUniversidadeStats() {
//     return this.http.get<UniversidadeStatsDTO>(`${this.apiUrl}/minha-universidade/stats`);
//   }
// }

@Component({
  selector: 'app-dashboard-admin-universidade',
  standalone: true, // Assuming it should be standalone
  imports: [CommonModule, RouterModule], // Add CommonModule and RouterModule
  templateUrl: './dashboard-admin-universidade.component.html',
  styleUrls: ['./dashboard-admin-universidade.component.css']
})
export class AdminUniversidadeDashboardComponent implements OnInit {
  stats: UniversidadeStatsDTO | null = null;
  loadingStats: boolean = true;
  statsError: string | null = null;

  // Temporary HttpClient injection - replace with AdminUniversidadeService
  private http = inject(HttpClient);

  constructor(
    // private adminUniversidadeService: AdminUniversidadeService // Inject actual service later
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;
    this.statsError = null;
    // Replace with this.adminUniversidadeService.getMinhaUniversidadeStats()
    this.http.get<UniversidadeStatsDTO>('/api/admin-universidade/minha-universidade/stats')
      .pipe(
        tap(data => {
          this.stats = data;
        }),
        catchError(error => {
          console.error('Erro ao buscar estatísticas da universidade:', error);
          this.statsError = 'Não foi possível carregar as estatísticas da universidade. Tente novamente mais tarde.';
          return of(null); // Handle error gracefully
        }),
        finalize(() => {
          this.loadingStats = false;
        })
      )
      .subscribe();
  }

  // Getter to safely access universidadeNome for the template
  get universidadeNome(): string {
    return this.stats?.universidadeNome || 'Universidade'; // Fallback name
  }
} 