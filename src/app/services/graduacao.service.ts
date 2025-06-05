import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Graduacao, GraduacaoDTO } from '../models/graduacao.model';

@Injectable({
  providedIn: 'root'
})
export class GraduacaoService {
  private apiUrl = '/api/v1/graduacoes'; // General API endpoint
  private funcionarioApiUrl = '/api/funcionariosecretaria/graduacoes'; // Secretary-specific endpoint

  constructor(private http: HttpClient) { }

  listarTodas(): Observable<Graduacao[]> {
    return this.http.get<Graduacao[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  listarGraduacoesParaSecretaria(): Observable<Graduacao[]> {
    return this.http.get<Graduacao[]>(this.funcionarioApiUrl)
      .pipe(catchError(this.handleError));
  }

  buscarPorId(id: number): Observable<Graduacao> {
    return this.http.get<Graduacao>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  buscarGraduacaoParaSecretariaPorId(id: number): Observable<Graduacao> {
    return this.http.get<Graduacao>(`${this.funcionarioApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  criar(graduacao: GraduacaoDTO): Observable<Graduacao> {
    return this.http.post<Graduacao>(this.funcionarioApiUrl, graduacao)
      .pipe(catchError(this.handleError));
  }

  atualizar(id: number, graduacao: GraduacaoDTO): Observable<Graduacao> {
    return this.http.put<Graduacao>(`${this.funcionarioApiUrl}/${id}`, graduacao)
      .pipe(catchError(this.handleError));
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.funcionarioApiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e o proxy.';
      } else if (error.error && typeof error.error === 'string' && error.error.length > 0) {
        errorMessage = error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Erro ${error.status}: ${error.statusText}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 