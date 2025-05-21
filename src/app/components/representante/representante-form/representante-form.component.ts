import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RepresentanteService } from '../../../services/representante.service';

@Component({
  selector: 'app-representante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './representante-form.component.html',
  styleUrl: './representante-form.component.css'
})
export class RepresentanteFormComponent {
  representanteForm: FormGroup;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private representanteService: RepresentanteService,
    private router: Router
  ) {
    this.representanteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      sobrenome: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}\-\d{4}$/)]],
      cargo: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.representanteForm.invalid) {
      this.markFormGroupTouched(this.representanteForm);
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    this.representanteService.create(this.representanteForm.value).subscribe({
      next: () => {
        this.success = 'Representante cadastrado com sucesso!';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/representantes']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Erro ao cadastrar representante: ' + (err.error?.message || err.message || 'Erro desconhecido');
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
