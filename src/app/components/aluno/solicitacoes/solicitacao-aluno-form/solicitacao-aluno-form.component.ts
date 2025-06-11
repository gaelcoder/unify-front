import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitacaoService } from '../../../../services/solicitacao.service';
import { SolicitacaoCreateDTO, TipoSolicitacao } from '../../../../models/solicitacao.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-solicitacao-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitacao-aluno-form.component.html',
})
export class SolicitacaoAlunoFormComponent implements OnInit {
  solicitacaoForm: FormGroup;
  tiposSolicitacao: { key: string, value: string }[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private solicitacaoService: SolicitacaoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.solicitacaoForm = this.fb.group({
      tipo: ['', Validators.required],
      mensagem: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.tiposSolicitacao = Object.keys(TipoSolicitacao).map(key => {
      return { key: key, value: TipoSolicitacao[key as keyof typeof TipoSolicitacao] };
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.solicitacaoForm.invalid) {
      this.solicitacaoForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.alunoId || !currentUser.universidadeId) {
      this.errorMessage = 'Erro: Informações do usuário não encontradas. Faça o login novamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.solicitacaoForm.value;
    const solicitacaoDTO: SolicitacaoCreateDTO = {
      tipo: formValue.tipo,
      mensagem: formValue.mensagem,
      alunoId: currentUser.alunoId,
      universidadeId: currentUser.universidadeId,
    };

    this.solicitacaoService.createSolicitacao(solicitacaoDTO).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/aluno/solicitacoes']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Ocorreu um erro ao criar a solicitação. Tente novamente mais tarde.';
        console.error(err);
      },
    });
  }
} 