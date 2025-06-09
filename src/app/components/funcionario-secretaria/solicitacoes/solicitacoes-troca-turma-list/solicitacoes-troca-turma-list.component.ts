import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-solicitacoes-troca-turma-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './solicitacoes-troca-turma-list.component.html',
  styleUrls: ['./solicitacoes-troca-turma-list.component.css']
})
export class FuncionarioSecretariaSolicitacoesTrocaTurmaListComponent {
  constructor() {}
} 