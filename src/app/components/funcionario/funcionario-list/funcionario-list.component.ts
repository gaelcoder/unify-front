import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // For routerLink and Router
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

// Actual Funcionario interface based on backend DTOs (adjust if necessary)
export interface Funcionario {
  id: number;
  nome: string;
  sobrenome: string;
  emailInstitucional: string;
  setor: 'RH' | 'Secretaria'; // Use specific types if known
  cargo?: string; // Cargo might be optional or part of another DTO
  primeiroAcesso?: boolean;
  // Add other relevant fields from your FuncionarioDTO
}

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], // HttpClientModule for direct http call
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.css']
})
export class FuncionarioListComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  loading: boolean = true;
  error: string | null = null;

  private http = inject(HttpClient);
  private router = inject(Router); // Added Router injection

  constructor() { }

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.loading = true;
    this.error = null;
    this.http.get<Funcionario[]>('/api/admin-universidade/funcionarios')
      .pipe(
        tap(data => {
          this.funcionarios = data;
        }),
        catchError(err => {
          console.error('Erro ao buscar funcionários:', err);
          this.error = 'Não foi possível carregar a lista de funcionários. Tente novamente mais tarde.';
          return of([]); // Return empty array on error to clear previous data
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  editarFuncionario(funcionario: Funcionario): void {
    // console.log('Editar (placeholder):', funcionario);
    this.router.navigate(['/funcionarios/editar', funcionario.id]);
  }

  excluirFuncionario(funcionario: Funcionario): void {
    console.log('Excluir (placeholder):', funcionario);
    // Implement actual exclusion logic with confirmation and API call
    // this.funcionarios = this.funcionarios.filter(f => f.id !== funcionario.id);
  }

  // Optional: Method to navigate to the new funcionário form
  navigateToNovoFuncionario(): void {
    this.router.navigate(['/funcionarios/novo']);
  }
}