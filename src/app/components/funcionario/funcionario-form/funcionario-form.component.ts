import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { FuncionarioService } from '../../../services/funcionario.service'; // Placeholder
// import { UniversidadeService } from '../../../services/universidade.service'; // Placeholder for university context
// import { Funcionario } from '../../../models/funcionario.model'; // Assuming model exists or will be created
// import { Universidade } from '../../../models/universidade.model'; // Assuming model exists

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
  // universidades: Universidade[] = []; // For dropdown if needed
  isLoading = false;
  errorMessage: string | null = null;
  setores = ['RH', 'Secretaria']; // Predefined sectors

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private funcionarioService: FuncionarioService,
    // private universidadeService: UniversidadeService // For fetching university info if required by form
  ) {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      emailPessoal: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required /*, Validators.pattern(/\d{3}\.\d{3}\.\d{3}-\d{2}/)*/]], // Add CPF validator if needed
      rg: [''], // Optional
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      setor: ['', Validators.required], // Dropdown for RH or Secretaria
      cargo: [''], // Optional or based on setor
      // universidadeId: [null, Validators.required] // If selecting university, otherwise get from admin's context
    });
  }

  ngOnInit(): void {
    this.funcionarioId = this.route.snapshot.params['id'];
    if (this.funcionarioId) {
      this.isEditMode = true;
      // this.loadFuncionarioData(this.funcionarioId); // Placeholder
      console.log('Edit mode for funcionario ID:', this.funcionarioId);
    } else {
      console.log('Create new funcionario mode.');
    }
    // this.loadUniversidades(); // If needed for a dropdown
  }

  // loadUniversidades(): void {
  //   // Placeholder: this.universidadeService.getAll().subscribe(data => this.universidades = data);
  // }

  // loadFuncionarioData(id: number): void {
  //   this.isLoading = true;
  //   // Placeholder: this.funcionarioService.getById(id).subscribe(
  //   //   data => {
  //   //     this.funcionarioForm.patchValue(data);
  //   //     this.isLoading = false;
  //   //   },
  //   //   error => {
  //   //     this.errorMessage = 'Erro ao carregar dados do funcionário.';
  //   //     this.isLoading = false;
  //   //   }
  //   // );
  // }

  onSubmit(): void {
    if (this.funcionarioForm.invalid) {
      this.errorMessage = "Por favor, preencha todos os campos obrigatórios.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    const formData = this.funcionarioForm.value;

    console.log('Form data submitted:', formData);

    // if (this.isEditMode && this.funcionarioId) {
    //   // Placeholder: this.funcionarioService.update(this.funcionarioId, formData).subscribe(
    //   //   () => {
    //   //     this.router.navigate(['/funcionarios']);
    //   //     this.isLoading = false;
    //   //   },
    //   //   error => {
    //   //     this.errorMessage = 'Erro ao atualizar funcionário.';
    //   //     this.isLoading = false;
    //   //   }
    //   // );
    // } else {
    //   // Placeholder: this.funcionarioService.create(formData).subscribe(
    //   //   () => {
    //   //     this.router.navigate(['/funcionarios']);
    //   //     this.isLoading = false;
    //   //   },
    //   //   error => {
    //   //     this.errorMessage = 'Erro ao criar funcionário.';
    //   //     this.isLoading = false;
    //   //   }
    //   // );
    // }
    setTimeout(() => { // Simulate API call
      this.isLoading = false;
      if (Math.random() > 0.1) { // Simulate success
         this.router.navigate(['/funcionarios']);
      } else { // Simulate error
        this.errorMessage = this.isEditMode ? 'Erro simulado ao atualizar funcionário.' : 'Erro simulado ao criar funcionário.';
      }
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/funcionarios']);
  }
} 