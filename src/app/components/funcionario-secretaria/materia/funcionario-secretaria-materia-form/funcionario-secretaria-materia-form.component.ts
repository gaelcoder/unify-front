import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-materia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h2>Formulário de Matéria (Secretaria)</h2>
    <p><em>Funcionalidade de formulário de matéria (novo/editar) a ser implementada.</em></p>
    <a routerLink="../" class="btn btn-secondary">Voltar para Lista</a>
  `,
  styles: []
})
export class FuncionarioSecretariaMateriaFormComponent implements OnInit {
  isEditMode = false;
  materiaId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.materiaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.materiaId;
    if (this.isEditMode) {
      console.log('Modo de Edição - Matéria ID:', this.materiaId);
    } else {
      console.log('Modo de Criação de Matéria');
    }
  }
} 