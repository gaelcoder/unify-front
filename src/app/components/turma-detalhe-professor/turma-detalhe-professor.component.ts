import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProfessorService } from '../../services/professor.service';
import { AvaliacaoDTO } from '../../core/dtos/avaliacao.dto';
import { TurmaDTO } from '../../core/dtos/turma.dto'; // Para exibir detalhes da turma

@Component({
  selector: 'app-turma-detalhe-professor',
  templateUrl: './turma-detalhe-professor.component.html',
  styleUrls: ['./turma-detalhe-professor.component.css']
})
export class TurmaDetalheProfessorComponent implements OnInit {
  turmaId!: number;
  turmaDetalhes$: Observable<TurmaDTO | null> = of(null); // Para carregar detalhes da turma se necessário
  avaliacoes$: Observable<AvaliacaoDTO[] | null> = of(null);
  errorLoading: string | null = null;
  showCreateAvaliacaoForm: boolean = false;
  avaliacaoForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.turmaId = Number(this.route.snapshot.paramMap.get('turmaId'));
    if (isNaN(this.turmaId)) {
      this.errorLoading = 'ID da Turma inválido.';
      return;
    }

    this.loadAvaliacoes();
    // Opcional: Carregar detalhes da turma se não vierem do estado da rota
    // this.turmaDetalhes$ = this.professorService.getTurmaById(this.turmaId); 

    this.avaliacaoForm = this.fb.group({
      nome: ['', Validators.required],
      dataPrevista: [''],
      valorMaximoPossivel: [null, [Validators.required, Validators.min(0.1)]]
    });
  }

  loadAvaliacoes(): void {
    this.avaliacoes$ = this.professorService.getAvaliacoesByTurma(this.turmaId)
      .pipe(
        catchError(err => {
          console.error('Erro ao buscar avaliações:', err);
          this.errorLoading = 'Falha ao carregar avaliações.';
          return of(null);
        })
      );
  }

  toggleCreateAvaliacaoForm(): void {
    this.showCreateAvaliacaoForm = !this.showCreateAvaliacaoForm;
    if (this.showCreateAvaliacaoForm) {
      this.avaliacaoForm.reset();
    }
  }

  onSubmitAvaliacao(): void {
    if (this.avaliacaoForm.invalid) {
      this.avaliacaoForm.markAllAsTouched();
      return;
    }

    const novaAvaliacao: AvaliacaoDTO = {
      ...this.avaliacaoForm.value,
      turmaId: this.turmaId
    };

    this.professorService.criarAvaliacao(novaAvaliacao)
      .pipe(
        tap(() => {
          this.loadAvaliacoes(); // Recarrega a lista
          this.showCreateAvaliacaoForm = false;
        }),
        catchError(err => {
          console.error('Erro ao criar avaliação:', err);
          // Tratar erro (ex: exibir mensagem para o usuário)
          alert('Falha ao criar avaliação. Verifique os dados e tente novamente.');
          return of(null);
        })
      )
      .subscribe();
  }

  navigateToNotas(avaliacaoId: number | undefined): void {
    if (avaliacaoId) {
      this.router.navigate(['/professor/turma', this.turmaId, 'avaliacao', avaliacaoId, 'notas']);
    } else {
      console.error('ID da avaliação inválido para navegação.');
    }
  }
  
  // TODO: Adicionar métodos para editar e deletar avaliações se necessário
} 