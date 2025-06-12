import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RepresentanteService } from '../../../services/representante.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-representante-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './representante-form.component.html',
  styleUrl: './representante-form.component.css'
})
export class RepresentanteFormComponent implements OnInit {
  representanteForm: FormGroup;
  submitting = false;
  loading = false;
  error = '';
  success = '';
  editMode = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private representanteService: RepresentanteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.representanteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      sobrenome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cargo: ['', [Validators.required]]
    });
  }

  get f() { return this.representanteForm.controls; }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.id = id;
        this.editMode = true;
        this.carregarRepresentante(Number(id));
        this.representanteForm.get('cpf')?.disable();
      }
    });
  }

  carregarRepresentante(id: number): void {
    this.loading = true;
    this.representanteService.getById(id).subscribe({
      next: (representante) => {
        this.representanteForm.patchValue({
          nome: representante.nome,
          sobrenome: representante.sobrenome,
          cpf: representante.cpf,
          dataNascimento: this.formatDate(representante.dataNascimento),
          email: representante.email,
          telefone: representante.telefone,
          cargo: representante.cargo
        });
        this.loading = false;
      },
      error: (erro) => {
        this.error = 'Erro ao carregar representante: ' + this.getErrorMessage(erro);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.representanteForm.invalid) {
      this.representanteForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    // Obter os valores do formulário, incluindo campos desabilitados
    const formData = { ...this.representanteForm.getRawValue() };

    if (this.editMode && this.id) {
      this.representanteService.update(+this.id, formData).subscribe({
        next: () => {
          this.success = 'Representante atualizado com sucesso!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/representantes']);
          }, 1500);
        },
        error: (erro) => {
          this.error = 'Erro ao atualizar representante: ' + this.getErrorMessage(erro);
          this.submitting = false;
        }
      });
    } else {
      this.representanteService.create(formData).subscribe({
        next: () => {
          this.success = 'Representante cadastrado com sucesso!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/representantes']);
          }, 1500);
        },
        error: (err) => {
          this.error = 'Erro ao cadastrar representante: ' + this.getErrorMessage(err);
          this.submitting = false;
        }
      });
    }
  }

  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (error.message) {
      return error.message;
    } else if (error.status === 0) {
      return 'Servidor não está respondendo. Verifique sua conexão.';
    } else {
      return 'Erro desconhecido';
    }
  }
}