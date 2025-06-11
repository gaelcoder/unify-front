import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao, SolicitacaoCreateDTO, SolicitacaoSecretariaDTO, SolicitacaoStatusUpdateDTO, StatusSolicitacao } from '../models/solicitacao.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {
  private apiUrl = '/api/solicitacoes';

  constructor(private http: HttpClient) { }

  getSolicitacoesByAluno(alunoId: number): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(`${this.apiUrl}/aluno/${alunoId}`);
  }

  createSolicitacao(solicitacao: SolicitacaoCreateDTO): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(this.apiUrl, solicitacao);
  }

  getSolicitacaoById(id: number): Observable<Solicitacao> {
    return this.http.get<Solicitacao>(`${this.apiUrl}/${id}`);
  }

  getSolicitacoesParaSecretaria(status: StatusSolicitacao, campus?: string): Observable<SolicitacaoSecretariaDTO[]> {
    let params = new HttpParams().set('status', status);
    if (campus) {
      params = params.set('campus', campus);
    }
    return this.http.get<SolicitacaoSecretariaDTO[]>(`${this.apiUrl}/secretaria`, { params });
  }

  updateSolicitacaoStatus(id: number, statusUpdate: SolicitacaoStatusUpdateDTO): Observable<Solicitacao> {
    return this.http.patch<Solicitacao>(`${this.apiUrl}/${id}/status`, statusUpdate);
  }
} 