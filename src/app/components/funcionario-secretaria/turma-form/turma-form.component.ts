import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  templateUrl: './turma-form.component.html'
})
export class TurmaFormComponent implements OnInit {
  turmaForm: FormGroup;
  isEditMode = false;
  turmaId?: number;
  materias: Materia[] = [];
  professores: Professor[] = [];
  campi: string[] = [];
  alunosElegiveis: Aluno[] = [];

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
      diaSemana: ['', Validators.required],
      campus: ['', Validators.required],
      limiteAlunos: [30, [Validators.required, Validators.min(1)]],
      alunoIds: [[]]
    });
  }

  ngOnInit(): void {
    this.turmaId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.turmaId;

    this.materiaService.listarMaterias().subscribe(materias => {
      this.materias = materias;
    });

    if (this.isEditMode && this.turmaId) {
      this.turmaService.getTurmaById(this.turmaId).subscribe(turma => {
        this.universidadeService.getCampusesByMateriaId(turma.materia.id).subscribe(campuses => {
          this.campi = campuses;
          this.turmaForm.patchValue(turma);
          this.turmaForm.get('materiaId')?.setValue(turma.materia.id);
          this.turmaForm.get('professorId')?.setValue(turma.professor.id);
          this.turmaForm.get('alunoIds')?.setValue(turma.alunos.map(a => a.id));

          this.turmaForm.get('materiaId')?.disable();
          this.turmaForm.get('turno')?.disable();
          this.turmaForm.get('diaSemana')?.disable();
          this.turmaForm.get('campus')?.disable();
          
          this.loadProfessoresDisponiveis();
          this.onCampusOuMateriaChange();
        });
      });
    }

    this.turmaForm.get('campus')?.valueChanges.subscribe(() => this.onCampusOuMateriaChange());
    this.turmaForm.get('materiaId')?.valueChanges.subscribe(() => this.onCampusOuMateriaChange());
    this.turmaForm.get('diaSemana')?.valueChanges.subscribe(() => {
      this.onCampusOuMateriaChange();
      this.loadProfessoresDisponiveis();
    });
    this.turmaForm.get('turno')?.valueChanges.subscribe(() => {
      this.onCampusOuMateriaChange();
      this.loadProfessoresDisponiveis();
    });
  }

  loadProfessoresDisponiveis(): void {
    const diaSemana = this.turmaForm.get('diaSemana')?.value;
    const turno = this.turmaForm.get('turno')?.value;
    if (diaSemana && turno) {
      this.professorService.getProfessoresDisponiveis(diaSemana, turno, this.turmaId).subscribe(professores => {
        this.professores = professores;
      });
    }
  }

  onCampusOuMateriaChange(): void {
    const campus = this.turmaForm.get('campus')?.value;
    const materiaId = this.turmaForm.get('materiaId')?.value;
    const diaSemana = this.turmaForm.get('diaSemana')?.value;
    const turno = this.turmaForm.get('turno')?.value;

    if (campus && materiaId && diaSemana && turno) {
      const turmaId = this.isEditMode ? this.turmaId : undefined;
      this.turmaService.getAlunosElegiveis(campus, materiaId, diaSemana, turno, turmaId).subscribe((alunos: Aluno[]) => {
        this.alunosElegiveis = alunos;
        if (!this.isEditMode) {
          this.turmaForm.get('alunoIds')?.setValue([]);
        }
      });
    }
  }

  onMateriaChange(event: any): void {
    const materiaId = event.target.value;
    if (materiaId) {
      this.universidadeService.getCampusesByMateriaId(materiaId).subscribe(campuses => {
        this.campi = campuses;
      });
    } else {
      this.campi = [];
    }
    this.turmaForm.get('campus')?.reset({ value: '', disabled: this.isEditMode });
  }

  onAlunoSelect(alunoId: number, event: any): void {
    const isChecked = event.target.checked;
    const limite = this.turmaForm.get('limiteAlunos')?.value;
    const currentSelection = this.turmaForm.get('alunoIds')?.value as number[];
    
    if (isChecked) {
      if (currentSelection.length >= limite) {
        alert('Limite de alunos na turma atingido!');
        event.target.checked = false;
        return;
      }
      this.turmaForm.get('alunoIds')?.setValue([...currentSelection, alunoId]);
    } else {
      this.turmaForm.get('alunoIds')?.setValue(currentSelection.filter(id => id !== alunoId));
    }
  }

  isAlunoSelecionado(alunoId: number): boolean {
    const currentSelection = this.turmaForm.get('alunoIds')?.value as number[];
    return currentSelection.includes(alunoId);
  }

  onSubmit(): void {
    if (this.turmaForm.invalid) {
      Object.keys(this.turmaForm.controls).forEach(field => {
        const control = this.turmaForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const formValue = this.turmaForm.getRawValue();

    if (this.isEditMode) {
      const turmaData = {
        professorId: formValue.professorId,
        alunoIds: formValue.alunoIds
      };
      this.turmaService.updateTurma(this.turmaId!, turmaData).subscribe(() => {
        this.router.navigate(['/funcionariosecretaria/turmas']);
      });
    } else {
      this.turmaService.createTurma(formValue).subscribe(() => {
        this.router.navigate(['/funcionariosecretaria/turmas']);
      });
    }
  }
} 