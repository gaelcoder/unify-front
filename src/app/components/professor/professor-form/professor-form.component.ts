import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfessorService } from '../../../services/professor.service';
import { ProfessorDTO } from '../../../models/professor.model';

@Component({
  selector: 'app-professor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent implements OnInit {
  professorForm: FormGroup;
  isEditMode = false;
  professorId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  titulacoes = ['Graduado', 'Especialista', 'Mestre', 'Doutor', 'Pós-Doutor']; // User's preferred list

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorService
  ) {
    this.professorForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Personal Email
      cpf: ['', [Validators.required]], // Add CPF mask/validation if needed
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      titulacao: ['', Validators.required],
      salario: [null, [Validators.required, Validators.min(0)]] // Add salario control
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.isEditMode = true;
      this.professorId = +idParam;
      this.loadProfessorData(this.professorId);
    }
  }

  loadProfessorData(id: number): void {
    this.isLoading = true;
    this.professorService.buscarPorId(id).subscribe(
      data => {
        this.professorForm.patchValue(data);
        if (this.isEditMode) {
          this.professorForm.get('cpf')?.disable(); // CPF usually not editable
        }
        this.isLoading = false;
      },
      error => {
        this.errorMessage = 'Erro ao carregar dados do professor.';
        console.error(this.errorMessage, error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.professorForm.invalid) {
      this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
      Object.values(this.professorForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const formData: ProfessorDTO = this.professorForm.getRawValue(); // Use getRawValue if some fields are disabled (like CPF)

    if (this.isEditMode && this.professorId) {
      this.professorService.update(this.professorId, formData).subscribe(
        () => {
          this.router.navigate(['/admin-universidade/professores']); // Adjust navigation as needed
          this.isLoading = false;
        },
        error => {
          this.errorMessage = 'Erro ao atualizar professor. Verifique os dados e tente novamente.';
          console.error(this.errorMessage, error);
          this.isLoading = false;
        }
      );
    } else {
      this.professorService.create(formData).subscribe(
        () => {
          this.router.navigate(['/admin-universidade/professores']); // Adjust navigation as needed
          this.isLoading = false;
        },
        error => {
          this.errorMessage = 'Erro ao criar professor. Verifique os dados e tente novamente.';
          console.error(this.errorMessage, error);
          this.isLoading = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-universidade/professores']); // Adjust navigation as needed
  }
} 