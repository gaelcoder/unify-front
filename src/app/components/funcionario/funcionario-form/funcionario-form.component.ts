import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Funcionario, FuncionarioDTO } from '../../../models/funcionario.model'; // Assuming model exists or will be created

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.css']
})

export class FuncionarioFormComponent implements OnInit {
  funcionarioForm: FormGroup;
  isEditMode = false;
  funcionarioId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  setores = ['RH', 'Secretaria'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private funcionarioService: FuncionarioService,
    // private universidadeService: UniversidadeService // For fetching university info if required by form
  ) {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      telefone: [''],
      setor: ['', Validators.required],
      salario: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.isEditMode = true;
      this.funcionarioId = +idParam; // Convert to number
      this.loadFuncionarioData(this.funcionarioId);
    } else {
      console.log('Create new funcionario mode.');
    }
    // this.loadUniversidades(); // If needed for a dropdown
  }

  // loadUniversidades(): void {
  //   // Placeholder: this.universidadeService.getAll().subscribe(data => this.universidades = data);
  // }

  loadFuncionarioData(id: number): void {
    this.isLoading = true;
    this.funcionarioService.buscarPorId(id).subscribe(
      data => {
        this.funcionarioForm.patchValue(data);
        if (this.isEditMode) {
          const cpfControl = this.funcionarioForm.get('cpf');
          if (cpfControl) {
            cpfControl.disable();
            console.log('CPF control disabled for edit mode.');
          } else {
            console.warn('CPF control not found in form group during loadFuncionarioData.');
          }
        }
        this.isLoading = false;
      },
      error => {
        this.errorMessage = 'Erro ao carregar dados do funcionário.';
        console.error(this.errorMessage, error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.funcionarioForm.invalid) {
      this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
      Object.values(this.funcionarioForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const formData: FuncionarioDTO = this.funcionarioForm.value;

    console.log('Form data submitted:', formData);

    if (this.isEditMode && this.funcionarioId) {
      this.funcionarioService.update(this.funcionarioId, formData).subscribe(
        () => {
          this.router.navigate(['/admin-universidade/funcionarios']);
          this.isLoading = false;
        },
        error => {
          this.errorMessage = 'Erro ao atualizar funcionário. Verifique os dados e tente novamente.';
          console.error(this.errorMessage, error);
          this.isLoading = false;
        }
      );
    } else {
      this.funcionarioService.create(formData).subscribe(
        () => {
          this.router.navigate(['/admin-universidade/funcionarios']);
          this.isLoading = false;
        },
        error => {
          this.errorMessage = 'Erro ao criar funcionário. Verifique os dados e tente novamente.';
          console.error(this.errorMessage, error);
          this.isLoading = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/admin-universidade/funcionarios']);
  }
} 