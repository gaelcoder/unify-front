import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-solicitacoes-transferencia-graduacao-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './solicitacoes-transferencia-graduacao-list.component.html',
  styleUrls: ['./solicitacoes-transferencia-graduacao-list.component.css']
})
export class FuncionarioSecretariaSolicitacoesTransferenciaGraduacaoListComponent {
  constructor() {}
} 