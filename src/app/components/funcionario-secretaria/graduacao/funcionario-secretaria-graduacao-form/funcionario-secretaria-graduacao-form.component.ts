import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-graduacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h2>Formulário de Graduação (Secretaria)</h2>
    <p><em>Funcionalidade de formulário de graduação (novo/editar) a ser implementada.</em></p>
    <a routerLink="../" class="btn btn-secondary">Voltar para Lista</a>
  `,
  styles: []
})
export class FuncionarioSecretariaGraduacaoFormComponent implements OnInit {
  isEditMode = false;
  graduacaoId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.graduacaoId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.graduacaoId;
    if (this.isEditMode) {
      console.log('Modo de Edição - Graduação ID:', this.graduacaoId);
    } else {
      console.log('Modo de Criação de Graduação');
    }
  }
} 