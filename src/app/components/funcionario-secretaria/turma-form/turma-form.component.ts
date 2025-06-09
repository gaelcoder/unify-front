import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TurmaService } from '../../../core/services/turma.service';
import { MateriaService } from '../../../services/materia.service';
import { ProfessorService } from '../../../services/professor.service';
import { Materia } from '../../../models/materia.model';
import { Professor } from '../../../models/professor.model';
import { Aluno } from '../../../models/aluno.model';
import { Turma, TurmaCreate } from '../../../models/turma.model';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UniversidadeService } from '../../../services/universidade.service';
import { Universidade } from '../../../models/universidade.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turma-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './turma-form.component.html',
  styleUrls: ['./turma-form.component.css']
})
export class TurmaFormComponent implements OnInit {
  turmaForm: FormGroup;
  isEditMode = false;
  turmaId?: number;
  materias: Materia[] = [];
  professores: Professor[] = [];
  campi: string[] = [];
  alunosElegiveis: Aluno[] = [];
  alunosSelecionados: Aluno[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private turmaService: TurmaService,
    private materiaService: MateriaService,
    private professorService: ProfessorService,
    private universidadeService: UniversidadeService
  ) {
    this.turmaForm = this.fb.group({
      materiaId: ['', Validators.required],
      professorId: ['', Validators.required],
      turno: ['', Validators.required],
      campus: ['', Validators.required],
      limiteAlunos: [30, [Validators.required, Validators.min(1)]],
      alunoIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.turmaId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.turmaId;

    if (this.isEditMode) {
      this.turmaService.getTurmaById(this.turmaId!).pipe(
        tap(turma => this.turmaForm.patchValue({
          materiaId: turma.materia.id,
          professorId: turma.professor.id,
          turno: turma.turno,
          campus: turma.campus,
          limiteAlunos: turma.limiteAlunos
        })),
        switchMap(turma => {
          this.alunosSelecionados = turma.alunos;
          return this.turmaService.getAlunosElegiveis(turma.campus, turma.materia.id);
        })
      ).subscribe((alunos: Aluno[]) => {
        this.alunosElegiveis = alunos;
        // Preencher o FormArray com os alunos que já estavam na turma
        const alunoIdsFArray = this.turmaForm.get('alunoIds') as FormArray;
        this.alunosSelecionados.forEach(aluno => alunoIdsFArray.push(this.fb.control(aluno.id)));
      });
    }

    this.turmaForm.get('campus')?.valueChanges.subscribe(val => this.onCampusOuMateriaChange());
    this.turmaForm.get('materiaId')?.valueChanges.subscribe(val => this.onCampusOuMateriaChange());
  }

  loadInitialData(): void {
    this.materiaService.listarMaterias().subscribe((data: Materia[]) => this.materias = data);
    this.professorService.listarProfessoresParaSecretaria().subscribe((data: Professor[]) => this.professores = data);
  }

  onCampusOuMateriaChange(): void {
    const campus = this.turmaForm.get('campus')?.value;
    const materiaId = this.turmaForm.get('materiaId')?.value;

    if (campus && materiaId) {
      this.turmaService.getAlunosElegiveis(campus, materiaId).subscribe((alunos: Aluno[]) => {
        this.alunosElegiveis = alunos;
        // Resetar seleções ao mudar o filtro
        this.alunosSelecionados = [];
        const alunoIdsFArray = this.turmaForm.get('alunoIds') as FormArray;
        alunoIdsFArray.clear();
      });
    }
  }

  onMateriaChange(event: any): void {
    const materiaId = event.target.value;
    if (materiaId) {
      this.universidadeService.getCampusesByMateriaId(materiaId).subscribe(campuses => {
        this.campi = campuses;
        this.turmaForm.get('campus')?.reset(); // Reseta o campus ao mudar a matéria
      });
      this.onCampusOuMateriaChange();
    } else {
      this.campi = [];
    }
  }

  onAlunoSelect(aluno: Aluno, event: any): void {
    const isChecked = event.target.checked;
    const alunoIdsFArray = this.turmaForm.get('alunoIds') as FormArray;

    if (isChecked) {
      if (this.alunosSelecionados.length >= this.turmaForm.get('limiteAlunos')?.value) {
        alert('Limite de alunos na turma atingido!');
        event.target.checked = false;
        return;
      }
      this.alunosSelecionados.push(aluno);
      alunoIdsFArray.push(this.fb.control(aluno.id));
    } else {
      const index = this.alunosSelecionados.findIndex(a => a.id === aluno.id);
      if (index > -1) {
        this.alunosSelecionados.splice(index, 1);
        alunoIdsFArray.removeAt(index);
      }
    }
  }

  isAlunoSelecionado(aluno: Aluno): boolean {
    return this.alunosSelecionados.some(a => a.id === aluno.id);
  }

  onSubmit(): void {
    if (this.turmaForm.invalid) {
      return;
    }

    const turmaData: TurmaCreate = this.turmaForm.value;

    if (this.isEditMode) {
      // O backend não suporta edição, então redirecionamos para a lista.
      // Em uma implementação real, chamaríamos um serviço de update.
      console.warn("Funcionalidade de edição não implementada no backend. Redirecionando...");
      this.router.navigate(['/funcionariosecretaria/turmas']);
    } else {
      this.turmaService.createTurma(turmaData).subscribe(() => {
        this.router.navigate(['/funcionariosecretaria/turmas']);
      });
    }
  }
} 