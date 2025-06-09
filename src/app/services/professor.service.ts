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

  listarProfessoresParaSecretaria(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.baseApiUrl}/funcionariosecretaria/professores`);
  }

  buscarPorId(id: number): Observable<Professor> {
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

  /**
   * Fetches professors belonging to a specific university.
   * The backend should ideally filter these, for example, by not returning professors 
   * who are already coordinating other courses if that's a business rule.
   * This method is intended for use cases like populating dropdowns for selection,
   * and might use a different, more generally accessible endpoint than RH-specific professor management.
   */
  listarProfessoresPorUniversidadeId(universidadeId: number): Observable<Professor[]> {
    // Path updated to match GraduacaoOperacoesController
    return this.http.get<Professor[]>(`${this.baseApiUrl}/graduacao-operacoes/professores/por-universidade/${universidadeId}`);
  }
} 