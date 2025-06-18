import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-solicitacao-detalhes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitacao-detalhes.component.html'
})
export class SolicitacaoDetalhesComponent implements OnInit {
  solicitacao: Solicitacao | undefined;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.solicitacaoService.getById(+id).subscribe({
        next: (data: any) => {
          this.solicitacao = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Falha ao carregar os detalhes da solicitação.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
} 