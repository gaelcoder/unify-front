import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Solicitacao } from '../../models/solicitacao.model';
import { SolicitacaoService } from '../../services/solicitacao.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitacao-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './solicitacao-detalhes.component.html',
  styleUrl: './solicitacao-detalhes.component.css'
})
export class SolicitacaoDetalhesComponent implements OnInit {
  solicitacao: Solicitacao | undefined;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private solicitacaoService: SolicitacaoService
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
          this.errorMessage = 'Failed to load solicitation details.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
} 