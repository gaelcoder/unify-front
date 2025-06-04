import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Graduacao, GraduacaoDTO } from '../models/graduacao.model';

@Injectable({
  providedIn: 'root'
})
export class GraduacaoService {
  private apiUrl = '/api/v1/graduacoes'; // Adjust if your API base URL is different or configured elsewhere

  constructor(private http: HttpClient) { }

  listarTodas(): Observable<Graduacao[]> {
    return this.http.get<Graduacao[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Graduacao> {
    return this.http.get<Graduacao>(`${this.apiUrl}/${id}`);
  }

  criar(graduacao: GraduacaoDTO): Observable<Graduacao> {
    return this.http.post<Graduacao>(this.apiUrl, graduacao);
  }

  atualizar(id: number, graduacao: GraduacaoDTO): Observable<Graduacao> {
    return this.http.put<Graduacao>(`${this.apiUrl}/${id}`, graduacao);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 