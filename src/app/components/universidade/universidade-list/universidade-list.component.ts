import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UniversidadeService } from '../../../services/universidade.service';
import { Universidade } from '../../../models/universidade.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-universidade-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './universidade-list.component.html',
  styleUrl: './universidade-list.component.css'
})
export class UniversidadeListComponent implements OnInit {
  universidades: Universidade[] = [];
  loading = true;
  error = '';

  constructor(private universidadeService: UniversidadeService) { }

  ngOnInit(): void {
    this.loadUniversidades();
  }

  loadUniversidades(): void {
    this.loading = true;
    this.universidadeService.getAll().subscribe({
      next: (data) => {
        this.universidades = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar universidades: ' + err.message;
        this.loading = false;
      }
    });
  }

  excluirUniversidade(universidade: any): void {
  if (!confirm(`Tem certeza que deseja excluir a universidade ${universidade.nome}?`)) {
    return;
  }

  this.loading = true;
  this.error = '';

  this.universidadeService.delete(universidade.id).subscribe({
    next: () => {
      
      this.loadUniversidades();
      
      // Opcional: Adicionar mensagem de sucesso temporária
      const successElement = document.createElement('div');
      successElement.className = 'alert alert-success alert-dismissible fade show';
      successElement.innerHTML = `
        Universidade ${universidade.nome} excluída com sucesso!
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
      this.error = 'Erro ao excluir universidade: ' + this.getErrorMessage(erro);
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
