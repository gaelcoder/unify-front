import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor, ProfessorDTO } from '../models/professor.model';
import { AuthService } from './auth.service';

export interface Turma {
  id: number;
  nomeMateria: string;
  turno: string;
  diaSemana: string;
  campus: string;
  numeroDeAlunos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getApiUrl(): string {
    if (this.authService.isFuncionarioRH()) {
      return `${this.baseApiUrl}/rh/professores`;
    } else if (this.authService.isProfessor()) {
        return `${this.baseApiUrl}/professores`;
    }
    console.warn('ProfessorService called by a user role not explicitly handled for API endpoint determination.');
    return `${this.baseApiUrl}/professores`; 
  }

  create(professorDto: ProfessorDTO): Observable<Professor> {
    return this.http.post<Professor>(`${this.getApiUrl()}/`, professorDto);
  }

  listarTodosPorUniversidade(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.getApiUrl()}`);
  }

  listarProfessoresParaSecretaria(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.baseApiUrl}/funcionariosecretaria/professores`);
  }

  buscarPorId(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.getApiUrl()}/${id}`);
  }

  update(id: number, professorDto: ProfessorDTO): Observable<Professor> {
    return this.http.put<Professor>(`${this.getApiUrl()}/${id}`, professorDto);
  }

  delete(id: number): Observable<void> {
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
    return this.http.get<Professor[]>(`${this.baseApiUrl}/graduacao-operacoes/professores/por-universidade/${universidadeId}`);
  }

  getTurmas(): Observable<Turma[]> {
    return this.http.get<Turma[]>(`${this.getApiUrl()}/turmas`);
  }

  gerarRelatorio(turmaId: number): Observable<Blob> {
    return this.http.get(`${this.getApiUrl()}/turmas/${turmaId}/relatorio`, {
      responseType: 'blob'
    });
  }
} 