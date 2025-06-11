import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma, TurmaCreate } from '../../models/turma.model';
import { Aluno } from '../../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {
  private apiUrl = '/api/funcionariosecretaria/turmas';

  constructor(private http: HttpClient) { }

  getTurmas(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.apiUrl);
  }

  getTurmaById(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.apiUrl}/${id}`);
  }

  createTurma(turma: TurmaCreate): Observable<Turma> {
    return this.http.post<Turma>(this.apiUrl, turma);
  }

  updateTurma(id: number, turma: any): Observable<Turma> {
    return this.http.put<Turma>(`${this.apiUrl}/${id}`, turma);
  }

  deleteTurma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAlunosElegiveis(campus: string, materiaId: number, diaSemana: string, turno: string, turmaId?: number): Observable<Aluno[]> {
    let params = new HttpParams()
      .set('campus', campus)
      .set('materiaId', materiaId.toString())
      .set('diaSemana', diaSemana)
      .set('turno', turno);
    if (turmaId) {
      params = params.set('turmaId', turmaId.toString());
    }
    return this.http.get<Aluno[]>(`${this.apiUrl}/alunos-elegiveis`, { params });
  }
} 