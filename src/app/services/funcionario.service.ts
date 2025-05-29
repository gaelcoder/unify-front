import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  create(funcionario: any): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}/admin-universidade/funcionario`, funcionario);
  }

}
