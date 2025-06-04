import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AlunoDTO } from '../models/aluno.model'; // Adjusted path if models are in a different directory

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  private apiBaseUrl = 'http://localhost:8080'; // Should be configurable or from environment
  private resourceUrl = `${this.apiBaseUrl}/api/funcionariosecretaria/alunos`;

  constructor(private http: HttpClient) { }

  listarAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.resourceUrl);
  }

  criarAluno(aluno: AlunoDTO): Observable<Aluno> {
    return this.http.post<Aluno>(this.resourceUrl, aluno);
  }

  buscarAlunoPorId(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.resourceUrl}/${id}`);
  }

  atualizarAluno(id: number, aluno: AlunoDTO): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.resourceUrl}/${id}`, aluno);
  }

  deletarAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}/${id}`);
  }
} 