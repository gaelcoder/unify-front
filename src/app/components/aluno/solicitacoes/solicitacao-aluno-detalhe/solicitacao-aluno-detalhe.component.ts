import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solicitacao-aluno-detalhe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Detalhes da Solicitação</h2>
      <p>Detalhes da solicitação #{{ solicitacaoId }}</p>
    </div>
  `
})
export class SolicitacaoAlunoDetalheComponent implements OnInit {
  solicitacaoId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.solicitacaoId = this.route.snapshot.paramMap.get('id');
  }
} 