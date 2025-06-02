import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable, of, forkJoin, map, startWith } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProfessorService } from '../../services/professor.service';
import { AvaliacaoDTO } from '../../core/dtos/avaliacao.dto';
import { AlunoSimplificadoDTO } from '../../core/dtos/aluno-simplificado.dto';
import { NotaDTO } from '../../core/dtos/nota.dto';

interface AlunoComNota {
  aluno: AlunoSimplificadoDTO;
  notaForm: FormGroup; // FormGroup para a nota do aluno
  notaExistenteId?: number;
}

@Component({
  selector: 'app-lancamento-notas',
  templateUrl: './lancamento-notas.component.html',
  styleUrls: ['./lancamento-notas.component.css']
})
export class LancamentoNotasComponent implements OnInit {
  turmaId!: number;
  avaliacaoId!: number;
  avaliacaoDetalhes$: Observable<AvaliacaoDTO | null> = of(null);
  alunosComNotas: AlunoComNota[] = []; // Array para popular o template
  
  notasForm!: FormGroup; // FormGroup principal que conterá o FormArray
  errorLoading: string | null = null;
  valorMaximoAvaliacao: number = 0; // Para validação e display

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorService,
    private fb: FormBuilder
  ) {
    this.notasForm = this.fb.group({
      notasAlunos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.turmaId = Number(this.route.snapshot.paramMap.get('turmaId'));
    this.avaliacaoId = Number(this.route.snapshot.paramMap.get('avaliacaoId'));

    if (isNaN(this.turmaId) || isNaN(this.avaliacaoId)) {
      this.errorLoading = 'IDs da Turma ou Avaliação inválidos.';
      return;
    }

    this.loadDadosAvaliacaoEAlunos();
  }

  get notasAlunosArray(): FormArray {
    return this.notasForm.get('notasAlunos') as FormArray;
  }

  loadDadosAvaliacaoEAlunos(): void {
    this.errorLoading = null;
    this.avaliacaoDetalhes$ = this.professorService.getAvaliacaoById(this.avaliacaoId).pipe(
      tap(avaliacao => {
        if (avaliacao) {
          this.valorMaximoAvaliacao = avaliacao.valorMaximoPossivel;
        }
      }),
      catchError(err => {
        console.error('Erro ao buscar detalhes da avaliação:', err);
        this.errorLoading = 'Falha ao carregar detalhes da avaliação.';
        return of(null);
      })
    );

    // ForkJoin para buscar alunos e suas notas existentes em paralelo
    forkJoin({
      alunos: this.professorService.getAlunosByTurma(this.turmaId),
      notasExistentes: this.professorService.getNotasByAvaliacao(this.avaliacaoId)
    }).pipe(
      map(data => {
        this.notasAlunosArray.clear(); // Limpa o FormArray antes de popular
        this.alunosComNotas = data.alunos.map(aluno => {
          const notaExistente = data.notasExistentes.find(n => n.alunoId === aluno.id);
          const notaFormGroup = this.fb.group({
            alunoId: [aluno.id],
            valorObtido: [
              notaExistente ? notaExistente.valorObtido : null, 
              [Validators.max(this.valorMaximoAvaliacao), Validators.min(0)]
            ],
            observacoes: [notaExistente ? notaExistente.observacoes : '']
          });
          this.notasAlunosArray.push(notaFormGroup); // Adiciona ao FormArray
          return {
            aluno: aluno,
            notaForm: notaFormGroup,
            notaExistenteId: notaExistente ? notaExistente.id : undefined
          };
        });
      }),
      catchError(err => {
        console.error('Erro ao buscar alunos ou notas:', err);
        this.errorLoading = 'Falha ao carregar alunos ou suas notas.';
        this.alunosComNotas = [];
        return of(null);
      })
    ).subscribe();
  }

  onSubmitNotas(): void {
    if (this.notasForm.invalid) {
      this.notasForm.markAllAsTouched(); // Marcar todos os campos para exibir erros
      alert('Existem erros no formulário. Por favor, verifique as notas inseridas.');
      return;
    }

    const notasParaSalvar: NotaDTO[] = this.notasAlunosArray.controls
      .map((group, index) => {
        const alunoComNota = this.alunosComNotas[index];
        const formValue = group.value;
        if (formValue.valorObtido === null && (formValue.observacoes === null || formValue.observacoes.trim() === '')) {
          return null; // Não envia se a nota e observação estiverem vazias/nulas
        }
        return {
          id: alunoComNota.notaExistenteId, // Inclui o ID da nota se já existir (para atualização)
          alunoId: formValue.alunoId,
          avaliacaoId: this.avaliacaoId,
          valorObtido: formValue.valorObtido,
          observacoes: formValue.observacoes
        };
      })
      .filter(nota => nota !== null) as NotaDTO[];

    if (notasParaSalvar.length === 0) {
      alert('Nenhuma nota ou observação preenchida para salvar.');
      return;
    }
    
    // Idealmente, aqui você faria um loop e chamaria o serviço para cada nota
    // ou, se o backend suportar, enviaria um array de notas.
    // Por simplicidade, vamos simular uma chamada para cada nota que precisa ser salva/atualizada.
    let operacoesConcluidas = 0;
    let falhas = 0;

    notasParaSalvar.forEach(notaDto => {
      this.professorService.lancarOuAtualizarNota(notaDto)
        .pipe(
          catchError(err => {
            console.error(`Erro ao salvar nota para aluno ID ${notaDto.alunoId}:`, err);
            falhas++;
            return of(null);
          })
        )
        .subscribe(response => {
          operacoesConcluidas++;
          if (operacoesConcluidas === notasParaSalvar.length) {
            if (falhas > 0) {
              alert(`${falhas} nota(s) falharam ao salvar. As demais foram salvas com sucesso. Recarregando dados...`);
            } else {
              alert('Todas as notas foram salvas com sucesso! Recarregando dados...');
            }
            this.loadDadosAvaliacaoEAlunos(); // Recarrega para mostrar IDs atualizados e quaisquer mudanças
          }
        });
    });
  }

  voltarParaAvaliacoes(): void {
    this.router.navigate(['/professor/turma', this.turmaId, 'detalhes']);
  }
} 