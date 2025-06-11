import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradeHorariaService {

  private apiUrl = 'http://localhost:8080/api/grade-horaria';

  constructor(private http: HttpClient) { }

  gerarGradeHoraria(alunoId: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar`, { alunoId }, {
      responseType: 'blob'
    });
  }
} 