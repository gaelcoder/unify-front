import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Simplified NotaDetalhada to match backend NotaDTO more closely for now
export interface NotaDetalhada {
  id?: number; // Nota ID
  avaliacaoId: number; // To know which Avaliacao this note belongs to
  valorObtido?: number;
  observacoes?: string;
  // Fields like nomeAvaliacao, dataAvaliacao, valorMaximoAvaliacao are removed for now
  // as they are not directly in NotaDTO. Backend would need to be enhanced or extra calls made.
}

// This interface assumes that getMinhasTurmasMatriculadas() will provide these details.
export interface TurmaComDetalhes {
  turmaId: number;
  nomeMateria: string;
  codigoTurma?: string;
  notaMinimaAprovacao?: number;
  // other fields from the DTO returned by /api/aluno/minhas-turmas if any
}

// Interface for the combined data structure used in the component
export interface DisplayTurmaComNotas extends TurmaComDetalhes {
  mediaFinal?: number;
  statusAprovacao?: string;
  notasDetalhadas: NotaDetalhada[];
}

@Injectable({
  providedIn: 'root'
})
export class MinhasNotasService {
  private notasApiUrl = '/api/notas';
  private alunoApiUrl = '/api/aluno';

  constructor(private http: HttpClient) { }

  getMinhasTurmasMatriculadas(): Observable<TurmaComDetalhes[]> { // Expecting an array of Turma info
    return this.http.get<TurmaComDetalhes[]>(`${this.alunoApiUrl}/minhas-turmas`);
  }

  getMinhasNotasNaTurma(turmaId: number): Observable<NotaDetalhada[]> { // Expecting NotaDetalhada[] (simplified)
    return this.http.get<NotaDetalhada[]>(`${this.notasApiUrl}/aluno/minhas-notas/turma/${turmaId}`);
  }

  getMinhaMediaFinalNaTurma(turmaId: number): Observable<{ media: number }> {
    return this.http.get<{ media: number }>(`${this.notasApiUrl}/aluno/minha-media/turma/${turmaId}`);
  }

  getMeuStatusAprovacaoNaTurma(turmaId: number): Observable<{ statusAprovacao: string }> {
    return this.http.get<{ statusAprovacao: string }>(`${this.notasApiUrl}/aluno/meu-status/turma/${turmaId}`);
  }
} 