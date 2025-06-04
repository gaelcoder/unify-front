import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecretariaDashboardStatsDTO } from '../core/dtos/secretaria-dashboard-stats.dto';

@Injectable({
  providedIn: 'root'
})
export class SecretariaService {

  // TODO: Amore, por favor, substitua esta URL pela URL base da sua API!
  private apiBaseUrl = 'http://localhost:8080'; // OU QUALQUER QUE SEJA SUA URL DA API
  private apiUrl = `${this.apiBaseUrl}/api/funcionariosecretaria`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<SecretariaDashboardStatsDTO> {
    return this.http.get<SecretariaDashboardStatsDTO>(`${this.apiUrl}/dashboard/stats`);
  }

  // Methods for Aluno management (to be added)
  // Methods for Materia management (to be added)
  // Methods for Graduacao management (to be added)
  // Methods for Turma management (to be added)
  // Methods for Solicitation processing (to be added if not handled by other services)
} 