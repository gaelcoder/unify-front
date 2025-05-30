import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario, FuncionarioDTO } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = 'http://localhost:8080/api/admin-universidade/funcionarios';

  constructor(private http: HttpClient) { }

  create(funcionarioDto: FuncionarioDTO): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}/`, funcionarioDto);
  }

  listarTodosPorUniversidade(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }

  update(id: number, funcionarioDto: FuncionarioDTO): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${id}`, funcionarioDto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
