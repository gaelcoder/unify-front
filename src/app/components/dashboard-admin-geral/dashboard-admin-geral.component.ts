import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Temporary for direct API call
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

// Interface for the expected stats from /api/admin/stats
export interface AdminGeralStatsDTO {
  totalUniversidades: number;
}

@Component({
  selector: 'app-dashboard-admin-geral',
  standalone: true, // Assuming it should be standalone to align with others
  imports: [CommonModule, RouterModule], // Add RouterModule here for routerLink
  templateUrl: './dashboard-admin-geral.component.html',
  styleUrls: ['./dashboard-admin-geral.component.css']
})
export class AdminGeralDashboardComponent implements OnInit {
  adminStats: AdminGeralStatsDTO | null = null;
  loadingStats: boolean = true;
  statsError: string | null = null;

  // Temporary HttpClient injection - replace with AdminGeralService
  private http = inject(HttpClient);

  constructor(
    // private adminGeralService: AdminGeralService // Inject actual service later
  ) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loadingStats = true;
    this.statsError = null;
    // Replace with this.adminGeralService.getStats()
    this.http.get<AdminGeralStatsDTO>('/api/admin/stats') 
      .pipe(
        tap(data => {
          this.adminStats = data;
        }),
        catchError(error => {
          console.error('Erro ao buscar estatísticas do admin geral:', error);
          this.statsError = 'Não foi possível carregar as estatísticas. Tente novamente mais tarde.';
          return of(null); // Handle error gracefully
        }),
        finalize(() => {
          this.loadingStats = false;
        })
      )
      .subscribe();
  }
} 