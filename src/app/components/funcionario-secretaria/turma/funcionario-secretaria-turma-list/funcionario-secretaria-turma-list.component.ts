import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-turma-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './funcionario-secretaria-turma-list.component.html',
  styleUrls: ['./funcionario-secretaria-turma-list.component.css']
})
export class FuncionarioSecretariaTurmaListComponent {
  constructor() {}
} 