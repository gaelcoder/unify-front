import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universidade } from '../models/universidade.model';

@Injectable({
  providedIn: 'root'
})
export class UniversidadeService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obter todas as universidades
  getAll(): Observable<Universidade[]> {
    return this.http.get<Universidade[]>(`${this.apiUrl}/universidades`);
  }

  // Obter universidade por ID
  getById(id: number): Observable<Universidade> {
    return this.http.get<Universidade>(`${this.apiUrl}/universidades/${id}`);
  }

  // Criar nova universidade
  create(universidade: any): Observable<Universidade> {
    return this.http.post<Universidade>(`${this.apiUrl}/universidades`, universidade);
  }

  // Atualizar universidade existente
  update(id: number, universidade: any): Observable<Universidade> {
    return this.http.put<Universidade>(`${this.apiUrl}/universidades/${id}`, universidade);
  }

  // Excluir universidade
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/universidades/${id}`);
  }

  // Associar representante à universidade
  associateRepresentante(universidadeId: number, representanteId: number): Observable<Universidade> {
    return this.http.put<Universidade>(`${this.apiUrl}/universidades/${universidadeId}/representante/${representanteId}`, {});
  }

  // Desassociar representante da universidade
  desassociarRepresentante(universidadeId: number): Observable<Universidade> {
    return this.http.delete<Universidade>(`${this.apiUrl}/universidades/${universidadeId}/representante`);
  }
}