import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RepresentanteService } from '../../../services/representante.service';
import { Representante } from '../../../models/representante.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-representante-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './representante-list.component.html',
  styleUrl: './representante-list.component.css'
})
export class RepresentanteListComponent implements OnInit {
  representantes: Representante[] = [];
  loading = true;
  error = '';

  constructor(private representanteService: RepresentanteService) { }

  ngOnInit(): void {
    this.loadRepresentantes();
  }

  loadRepresentantes(): void {
    this.loading = true;
    this.representanteService.listarTodos().subscribe({
      next: (data) => {
        this.representantes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar representantes: ' + err.message;
        this.loading = false;
      }
    });
  }
  excluirRepresentante(representante: any): void {
    // Verifica se o representante está associado a uma universidade
    if (representante.universidade) {
      this.error = 'Não é possível excluir um representante associado a uma universidade';
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o representante ${representante.nome} ${representante.sobrenome}?`)) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.representanteService.excluir(representante.id).subscribe({
      next: () => {

        this.loadRepresentantes();

        // Adiciona mensagem de sucesso temporária
        const successElement = document.createElement('div');
        successElement.className = 'alert alert-success alert-dismissible fade show';
        successElement.innerHTML = `
          Representante ${representante.nome} ${representante.sobrenome} excluído com sucesso!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.querySelector('.container')?.insertBefore(successElement, document.querySelector('.d-flex'));
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
          successElement.remove();
        }, 3000);
        
        this.loading = false;
      },
      error: (erro) => {
        this.error = 'Erro ao excluir representante: ' + this.getErrorMessage(erro);
        this.loading = false;
      }
    });
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
