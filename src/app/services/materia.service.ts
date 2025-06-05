import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Materia, MateriaDTO } from '../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = '/api/funcionariosecretaria/materias'; // Relative path for proxy

  constructor(private http: HttpClient) { }

  listarMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  buscarMateriaPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  criarMateria(materiaDto: MateriaDTO): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materiaDto)
      .pipe(catchError(this.handleError));
  }

  atualizarMateria(id: number, materiaDto: MateriaDTO): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materiaDto)
      .pipe(catchError(this.handleError));
  }

  deletarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente ou de rede
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // O backend retornou um código de resposta malsucedido.
      // O corpo da resposta pode conter pistas sobre o que deu errado.
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e o proxy.';
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error; // Simple string error
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message; // Error object with message property
      } else {
        errorMessage = `Erro ${error.status}: ${error.statusText}`;
        if (error.error && typeof error.error === 'object') {
          const messages = Object.values(error.error).join('; ');
          if (messages) errorMessage += ` Detalhes: ${messages}`;
        }
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 