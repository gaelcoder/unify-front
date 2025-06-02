import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MinhasNotasService, DisplayTurmaComNotas, TurmaComDetalhes, NotaDetalhada } from '../../services/minhas-notas.service';
// import { AvaliacaoService } from '../../services/avaliacao.service'; // Potentially needed to get avaliacao names

@Component({
  selector: 'app-minhas-notas',
  templateUrl: './minhas-notas.component.html',
  // styleUrls: [] // No SCSS file as per user request
})
export class MinhasNotasComponent implements OnInit {
  turmasComNotasDisplay: DisplayTurmaComNotas[] = [];
  isLoading = true;
  errorLoadingTurmas = false;
  errorMessage: string | null = null;

  constructor(
    private minhasNotasService: MinhasNotasService,
    // private avaliacaoService: AvaliacaoService // Uncomment if fetching Avaliacao details
  ) { }

  ngOnInit(): void {
    this.loadTurmasComNotas();
  }

  loadTurmasComNotas(): void {
    this.isLoading = true;
    this.errorLoadingTurmas = false;
    this.errorMessage = null;

    this.minhasNotasService.getMinhasTurmasMatriculadas().pipe(
      switchMap((turmas: TurmaComDetalhes[]) => {
        if (!turmas || turmas.length === 0) {
          this.isLoading = false;
          return of([]); // Return empty observable array if no turmas
        }
        // For each turma, create an observable that fetches all its details
        const observables = turmas.map(turma => {
          return forkJoin({
            notas: this.minhasNotasService.getMinhasNotasNaTurma(turma.turmaId).pipe(catchError(() => of([] as NotaDetalhada[]))),
            media: this.minhasNotasService.getMinhaMediaFinalNaTurma(turma.turmaId).pipe(catchError(() => of({ media: null }))),
            status: this.minhasNotasService.getMeuStatusAprovacaoNaTurma(turma.turmaId).pipe(catchError(() => of({ statusAprovacao: 'Erro ao buscar status' })))
          }).pipe(
            map(details => {
              // TODO: To get `nomeAvaliacao` for each `NotaDetalhada`,
              // we would need to fetch Avaliacao details, perhaps using `details.notas.avaliacaoId`.
              // This would likely involve another service call, e.g., to `AvaliacaoService.getById(avaliacaoId)`
              // and then map it. For now, `nomeAvaliacao` will be missing from `NotaDetalhada`.

              return {
                ...turma, // Spread turma details (turmaId, nomeMateria, codigoTurma, notaMinimaAprovacao)
                notasDetalhadas: details.notas,
                mediaFinal: details.media.media,
                statusAprovacao: details.status.statusAprovacao
              } as DisplayTurmaComNotas;
            })
          );
        });
        return forkJoin(observables);
      }),
      catchError(err => {
        console.error('Erro ao carregar informações das turmas:', err);
        this.isLoading = false;
        this.errorLoadingTurmas = true;
        this.errorMessage = err.message || 'Um erro desconhecido ocorreu.';
        return of([]); // Return empty array on error
      })
    ).subscribe((turmasComNotas) => {
      this.turmasComNotasDisplay = turmasComNotas;
      this.isLoading = false;
    });
  }

  getMediaClass(media: number | null | undefined, notaMinima: number | null | undefined): string {
    if (media === null || media === undefined || notaMinima === null || notaMinima === undefined) {
      return ''; // No class if data is incomplete
    }
    if (media >= notaMinima) return 'text-media-alta'; // Assuming notaMinima is the pass mark
    if (media >= notaMinima * 0.6) return 'text-media-media'; // Example threshold for medium
    return 'text-media-baixa';
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'text-pendente';
    if (status.toLowerCase().includes('aprovado')) return 'text-aprovado';
    if (status.toLowerCase().includes('reprovado')) return 'text-reprovado';
    return 'text-pendente';
  }
} 