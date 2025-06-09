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

  deleteTurma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAlunosElegiveis(campus: string, materiaId: number): Observable<Aluno[]> {
    let params = new HttpParams();
    params = params.append('campus', campus);
    params = params.append('materiaId', materiaId.toString());

    return this.http.get<Aluno[]>(`${this.apiUrl}/alunos-elegiveis`, { params });
  }
} 