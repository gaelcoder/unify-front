import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Solicitacao, StatusSolicitacao, TipoSolicitacao } from '../../../../models/solicitacao.model';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-solicitacao-aluno-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './solicitacao-aluno-list.component.html',
})
export class SolicitacaoAlunoListComponent implements OnInit {
  solicitacoes: Solicitacao[] = [];
  currentUser: User | null = null;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser && this.currentUser.alunoId) {
      this.solicitacaoService.getSolicitacoesByAluno(this.currentUser.alunoId).subscribe((data: Solicitacao[]) => {
        this.solicitacoes = data;
      });
    }
  }
} 