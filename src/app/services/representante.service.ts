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

  listarTodos(): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.apiUrl}/admin/representantes`);
  }

  getAvailable(): Observable<Representante[]> {
    return this.http.get<Representante[]>(`${this.apiUrl}/admin/representantes/disponiveis`);
  }

  create(representante: any): Observable<Representante> {
    return this.http.post<Representante>(`${this.apiUrl}/admin/representantes`, representante);
  }

// Excluir representante
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/representantes/${id}`);
  }

  update(id: number, representante: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/representantes/${id}`, representante);
  }

// Obter representante por ID
  getById(id: number): Observable<Representante> {
    return this.http.get<Representante>(`${this.apiUrl}/admin/representantes/${id}`);
  }



}
