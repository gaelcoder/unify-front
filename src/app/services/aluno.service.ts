import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno, AlunoDTO } from '../models/aluno.model'; // Adjusted path if models are in a different directory

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  // private apiBaseUrl = 'http://localhost:8080'; // No longer needed for resourceUrl
  private resourceUrl = '/api/funcionariosecretaria/alunos'; // Changed to relative path

  constructor(private http: HttpClient) {
    console.log('[AlunoService] Constructor called');
  }

  listarAlunos(): Observable<Aluno[]> {
    console.log('[AlunoService] listarAlunos called');
    console.log(`[AlunoService] Making HTTP GET request to: ${this.resourceUrl}`);
    return this.http.get<Aluno[]>(this.resourceUrl);
  }

  criarAluno(aluno: AlunoDTO): Observable<Aluno> {
    // If other methods also use apiBaseUrl, they might need adjustment too,
    // but focusing on listarAlunos for now.
    // Assuming they also use relative paths or this.resourceUrl format
    const createUrl = '/api/funcionariosecretaria/alunos'; // Example for consistency
    return this.http.post<Aluno>(createUrl, aluno);
  }

  buscarAlunoPorId(id: number): Observable<Aluno> {
    const searchUrl = `/api/funcionariosecretaria/alunos/${id}`;
    return this.http.get<Aluno>(searchUrl);
  }

  atualizarAluno(id: number, aluno: AlunoDTO): Observable<Aluno> {
    const updateUrl = `/api/funcionariosecretaria/alunos/${id}`;
    return this.http.put<Aluno>(updateUrl, aluno);
  }

  deletarAluno(id: number): Observable<void> {
    const deleteUrl = `/api/funcionariosecretaria/alunos/${id}`;
    return this.http.delete<void>(deleteUrl);
  }
} 