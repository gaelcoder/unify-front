import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor, ProfessorDTO } from '../models/professor.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getApiUrl(): string {
    // Assuming only FUNCIONARIO_RH can manage professors through this specific path for now
    if (this.authService.isFuncionarioRH()) {
      return `${this.baseApiUrl}/rh/professores`;
    }
    // Fallback or error if other roles attempt to use this service without a defined path
    // This might need adjustment if other roles get professor management capabilities at different endpoints
    console.warn('ProfessorService called by a user role not explicitly handled for API endpoint determination.');
    return `${this.baseApiUrl}/rh/professores`; // Defaulting to RH path, consider throwing error or specific handling
  }

  create(professorDto: ProfessorDTO): Observable<Professor> {
    return this.http.post<Professor>(`${this.getApiUrl()}/`, professorDto);
  }

  listarTodosPorUniversidade(): Observable<Professor[]> {
    // The backend for /api/rh/professores by default lists for the RH's university
    return this.http.get<Professor[]>(`${this.getApiUrl()}`);
  }

  buscarPorId(id: number): Observable<Professor> {
    // Assuming an endpoint like /api/rh/professores/{id} exists or will be created
    // The backend FuncionarioRHController has GET /professores but not GET /professores/{id}
    // This might require backend adjustment or this method might not be used by RH directly if not available.
    // For now, assuming it might be added or listing is the primary use case.
    return this.http.get<Professor>(`${this.getApiUrl()}/${id}`);
  }

  update(id: number, professorDto: ProfessorDTO): Observable<Professor> {
    // Assuming an endpoint like /api/rh/professores/{id} for updates
    return this.http.put<Professor>(`${this.getApiUrl()}/${id}`, professorDto);
  }

  delete(id: number): Observable<void> {
    // Assuming an endpoint like /api/rh/professores/{id} for deletion
    return this.http.delete<void>(`${this.getApiUrl()}/${id}`);
  }
} 