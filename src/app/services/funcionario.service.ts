import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario, FuncionarioDTO } from '../models/funcionario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getApiUrl(): string {
    if (this.authService.isFuncionarioRH()) {
      return `${this.baseApiUrl}/rh/funcionarios`;
    }
    // Default for AdminUniversidade or other roles that might manage this
    return `${this.baseApiUrl}/admin-universidade/funcionarios`;
  }

  create(funcionarioDto: FuncionarioDTO): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.getApiUrl()}/`, funcionarioDto);
  }

  listarTodosPorUniversidade(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.getApiUrl());
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.getApiUrl()}/${id}`);
  }

  update(id: number, funcionarioDto: FuncionarioDTO): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.getApiUrl()}/${id}`, funcionarioDto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl()}/${id}`);
  }

}
