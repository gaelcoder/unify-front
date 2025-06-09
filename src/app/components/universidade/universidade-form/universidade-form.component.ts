import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { UniversidadeService } from '../../../services/universidade.service';
import { RepresentanteService } from '../../../services/representante.service';
import { Representante } from '../../../models/representante.model';

@Component({
  selector: 'app-universidade-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './universidade-form.component.html',
  styleUrl: './universidade-form.component.css'
})
export class UniversidadeFormComponent implements OnInit {
  universidadeForm!: FormGroup;
  editMode = false;
  loading = false;
  submitting = false;
  error = '';
  success: string | null = null;
  id: string | null = null;
  selectedLogoFile: File | null = null;
  logoPreviewUrl: string | ArrayBuffer | null = null;
  
  representantesDisponiveis: Representante[] = [];
  carregandoRepresentantes = false;
  universidadeAtual: any = null;
  representanteAtual: Representante | null | undefined = null;

  get campusArray() {
    return this.universidadeForm.get('campus') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private universidadeService: UniversidadeService,
    private representanteService: RepresentanteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Obtém o ID da rota
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.editMode = true;
        // Garantindo que this.id não é null antes de usar
        if (this.id) {
          this.carregarUniversidade(+this.id);
        }
      }
    });

    // Carregar representantes disponíveis
    this.carregarRepresentantesDisponiveis();
  }

  initForm(): void {
    this.universidadeForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, Validators.pattern('\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}')]],
      fundacao: ['', Validators.required],
      sigla: ['', [Validators.required, Validators.maxLength(10)]],
      logo: [null],
      campus: this.fb.array([this.fb.control('')]),
      representanteId: [null]
    });
  }

  carregarRepresentantesDisponiveis(): void {
    this.carregandoRepresentantes = true;
    this.representanteService.getAvailable().subscribe({
      next: (representantes) => {
        this.representantesDisponiveis = representantes;
        this.carregandoRepresentantes = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar representantes:', erro);
        this.error = 'Não foi possível carregar os representantes: ' + this.getErrorMessage(erro);
        this.carregandoRepresentantes = false;
      }
    });
  }

  carregarUniversidade(id: number): void {
    this.loading = true;
    this.universidadeService.getById(id).subscribe({
      next: (universidade) => {
        this.universidadeAtual = universidade;
        this.representanteAtual = universidade.representante;
        
        // Limpar o array de campus existente
        while (this.campusArray.length > 0) {
          this.campusArray.removeAt(0);
        }
        
        // Preencher o formulário com os dados da universidade
        this.universidadeForm.patchValue({
          nome: universidade.nome,
          cnpj: universidade.cnpj,
          fundacao: this.formatDate(universidade.fundacao),
          sigla: universidade.sigla,
          representanteId: universidade.representante?.id || null
        });

        // Desativar a edição do CNPJ
        this.universidadeForm.get('cnpj')?.disable();
        
        // Adicionar os campus
        if (universidade.campus && universidade.campus.length > 0) {
          universidade.campus.forEach((campus: string) => {
            this.campusArray.push(this.fb.control(campus));
          });
        } else {
          this.addCampus(); // Adiciona um campo vazio se não houver campus
        }
        
        this.loading = false;
      },
      error: (erro) => {
        this.error = 'Erro ao carregar universidade: ' + this.getErrorMessage(erro);
        this.loading = false;
      }
    });
  }

  // Função para formatar a data vinda do backend para o formato esperado pelo input date
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  addCampus(): void {
    this.campusArray.push(this.fb.control(''));
  }

  removeCampus(index: number): void {
    this.campusArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.universidadeForm.invalid) {
      return;
    }

    this.submitting = true;
    const formValues = { ...this.universidadeForm.getRawValue() }; 

    const formData = new FormData();
    formData.append('universidade', new Blob([JSON.stringify({
      nome: formValues.nome,
      cnpj: formValues.cnpj,
      fundacao: formValues.fundacao,
      sigla: formValues.sigla,
      campus: formValues.campus.filter((c: string) => c.trim() !== ''),
      representanteId: formValues.representanteId
    })], { type: 'application/json' }));

    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile, this.selectedLogoFile.name);
    }
    
    if (this.editMode && this.id) {
      this.universidadeService.update(+this.id, formData).subscribe({
        next: () => {
          this.success = 'Universidade atualizada com sucesso!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/universidades']);
          }, 1500);
        },
        error: (erro) => {
          this.error = 'Erro ao atualizar universidade: ' + this.getErrorMessage(erro);
          this.submitting = false;
        }
      });
    } else {
      this.universidadeService.create(formData).subscribe({
        next: () => {
          this.success = 'Universidade cadastrada com sucesso!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/universidades']);
          }, 1500);
        },
        error: (erro) => {
          this.error = 'Erro ao cadastrar universidade: ' + this.getErrorMessage(erro);
          this.submitting = false;
        }
      });
    }
  }
  
  excluirUniversidade(): void {
    if (!this.id) {
      this.error = 'ID da universidade não encontrado.';
      return;
    }
    
    if (!confirm('Tem certeza que deseja excluir esta universidade?')) {
      return;
    }
    
    this.submitting = true;
    this.universidadeService.delete(+this.id).subscribe({
      next: () => {
        this.success = 'Universidade excluída com sucesso!';
        this.submitting = false;
        setTimeout(() => {
          this.router.navigate(['/universidades']);
        }, 1500);
      },
      error: (erro) => {
        this.error = 'Erro ao excluir universidade: ' + this.getErrorMessage(erro);
        this.submitting = false;
      }
    });
  }
  
  desassociarRepresentante(): void {
    if (!this.id || !this.representanteAtual) {
      this.error = 'Não há representante associado a esta universidade.';
      return;
    }
    
    if (!confirm(`Tem certeza que deseja desassociar o representante ${this.representanteAtual.nome} desta universidade?`)) {
      return;
    }
    
    this.submitting = true;
    this.universidadeService.desassociarRepresentante(+this.id).subscribe({
      next: (universidade) => {
        this.success = 'Representante desassociado com sucesso!';
        this.submitting = false;
        this.universidadeAtual = universidade;
        this.representanteAtual = null;
        this.universidadeForm.patchValue({ representanteId: null });
        // Recarregar os representantes disponíveis
        this.carregarRepresentantesDisponiveis();
      },
      error: (erro) => {
        this.error = 'Erro ao desassociar representante: ' + this.getErrorMessage(erro);
        this.submitting = false;
      }
    });
  }
  
  associarRepresentante(): void {
    const representanteId = this.universidadeForm.get('representanteId')?.value;
    if (!this.id || !representanteId) {
      this.error = 'Selecione um representante para associar.';
      return;
    }
    
    this.submitting = true;
    this.universidadeService.associateRepresentante(+this.id, representanteId).subscribe({
      next: (universidade) => {
        this.success = 'Representante associado com sucesso!';
        this.submitting = false;
        this.universidadeAtual = universidade;
        this.representanteAtual = universidade.representante;
        // Recarregar os representantes disponíveis
        this.carregarRepresentantesDisponiveis();
      },
      error: (erro) => {
        this.error = 'Erro ao associar representante: ' + this.getErrorMessage(erro);
        this.submitting = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedLogoFile = fileList[0];
      this.universidadeForm.patchValue({ logo: this.selectedLogoFile });
      // For preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedLogoFile);
    } else {
      this.selectedLogoFile = null;
      this.logoPreviewUrl = null;
      this.universidadeForm.patchValue({ logo: null });
    }
  }

  // Método auxiliar para extrair mensagens de erro
  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    } else if (error.message) {
      return error.message;
    } else if (error.status === 0) {
      return 'Servidor não está respondendo. Verifique sua conexão.';
    } else if (error.status === 404) {
      return 'Recurso não encontrado.';
    } else if (error.status === 405) {
      return 'Método não permitido. Verifique a configuração da API.';
    } else if (error.status === 500) {
      return 'Erro interno do servidor.';
    } else {
      return 'Erro desconhecido';
    }
  }
}