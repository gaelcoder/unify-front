import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professor, ProfessorDTO } from '../models/professor.model';
import { AuthService } from './auth.service';
import { TurmaDTO } from '../core/dtos/turma.dto';
import { AvaliacaoDTO } from '../core/dtos/avaliacao.dto';
import { NotaDTO } from '../core/dtos/nota.dto';
import { AlunoSimplificadoDTO } from '../core/dtos/aluno-simplificado.dto';

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

  // --- Turmas do Professor ---
  getMinhasTurmas(): Observable<TurmaDTO[]> {
    // Ajuste este endpoint conforme sua API (ex: /api/professor/turmas)
    return this.http.get<TurmaDTO[]>(`${this.getApiUrl()}/professor/minhas-turmas`); 
  }

  // --- Alunos de uma Turma ---
  getAlunosByTurma(turmaId: number): Observable<AlunoSimplificadoDTO[]> {
    // Ajuste este endpoint (ex: /api/turmas/{turmaId}/alunos)
    return this.http.get<AlunoSimplificadoDTO[]>(`${this.getApiUrl()}/turmas/${turmaId}/alunos`);
  }

  // --- Avaliações ---
  criarAvaliacao(avaliacaoData: AvaliacaoDTO): Observable<AvaliacaoDTO> {
    return this.http.post<AvaliacaoDTO>(`${this.getApiUrl()}/avaliacoes`, avaliacaoData);
  }

  getAvaliacoesByTurma(turmaId: number): Observable<AvaliacaoDTO[]> {
    return this.http.get<AvaliacaoDTO[]>(`${this.getApiUrl()}/avaliacoes`, { params: new HttpParams().set('turmaId', turmaId.toString()) });
  }
  
  getAvaliacaoById(avaliacaoId: number): Observable<AvaliacaoDTO> {
    return this.http.get<AvaliacaoDTO>(`${this.getApiUrl()}/avaliacoes/${avaliacaoId}`);
  }

  atualizarAvaliacao(avaliacaoId: number, avaliacaoData: AvaliacaoDTO): Observable<AvaliacaoDTO> {
    return this.http.put<AvaliacaoDTO>(`${this.getApiUrl()}/avaliacoes/${avaliacaoId}`, avaliacaoData);
  }

  deletarAvaliacao(avaliacaoId: number): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl()}/avaliacoes/${avaliacaoId}`);
  }

  // --- Notas ---
  lancarOuAtualizarNota(notaData: NotaDTO): Observable<NotaDTO> {
    return this.http.post<NotaDTO>(`${this.getApiUrl()}/notas`, notaData);
  }

  getNotasByAvaliacao(avaliacaoId: number): Observable<NotaDTO[]> {
    return this.http.get<NotaDTO[]>(`${this.getApiUrl()}/notas`, { params: new HttpParams().set('avaliacaoId', avaliacaoId.toString()) });
  }

  getNotaEspecifica(alunoId: number, avaliacaoId: number): Observable<NotaDTO> {
    return this.http.get<NotaDTO>(`${this.getApiUrl()}/notas/aluno/${alunoId}/avaliacao/${avaliacaoId}`);
  }
} 