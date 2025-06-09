import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionario-secretaria-turma-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './funcionario-secretaria-turma-form.component.html',
  styleUrls: ['./funcionario-secretaria-turma-form.component.css']
})
export class FuncionarioSecretariaTurmaFormComponent implements OnInit {
  isEditMode = false;
  turmaId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.turmaId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.turmaId;
    if (this.isEditMode) {
      console.log('Modo de Edição - Turma ID:', this.turmaId);
    } else {
      console.log('Modo de Criação de Turma');
    }
  }
} 