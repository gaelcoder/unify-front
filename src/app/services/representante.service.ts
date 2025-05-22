import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Representante } from '../models/representante.model';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Obter todos os representantes
  getAll(): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.apiUrl}/representantes`);
  }

  // Obter representantes disponíveis (sem universidade associada)
  getAvailable(): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.apiUrl}/representantes/disponiveis`);
  }

  // Obter representante por ID
  getById(id: number): Observable<Representante> {
    return this.http.get<Representante>(`${this.apiUrl}/representantes/${id}`);
  }

  // Criar novo representante
  create(representante: any): Observable<Representante> {
    return this.http.post<Representante>(`${this.apiUrl}/representantes`, representante);
  }

  // Excluir representante
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/representantes/${id}`);
  }

  update(id: number, representante: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/representantes/${id}`, representante);
  }


}