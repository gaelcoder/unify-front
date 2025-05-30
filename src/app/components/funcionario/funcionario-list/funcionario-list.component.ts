import { Component, OnInit, inject } from '@angular/core';
// HttpClientModule removed, HttpClient might be removed if not used elsewhere
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FuncionarioService } from '../../../services/funcionario.service'; // Adjusted path
import { Funcionario } from '../../../models/funcionario.model'; // Assuming Funcionario model exists

// Interface definition can be removed if Funcionario is imported from models

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // HttpClientModule removed
  templateUrl: './funcionario-list.component.html',
  styleUrls: ['./funcionario-list.component.css']
})
export class FuncionarioListComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  loading: boolean = true;
  error: string | null = null;

  // HttpClient injection removed
  private router = inject(Router);

  constructor(private funcionarioService: FuncionarioService) { } // Injected FuncionarioService

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.loading = true;
    this.error = null;
    this.funcionarioService.listarTodosPorUniversidade() // Using the service method
      .pipe(
        tap(data => {
          this.funcionarios = data;
        }),
        catchError(err => {
          console.error('Erro ao buscar funcionários:', err);
          this.error = 'Não foi possível carregar a lista de funcionários. Tente novamente mais tarde.';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }

  editarFuncionario(funcionario: Funcionario): void {
    this.router.navigate(['/admin-universidade/funcionarios/editar', funcionario.id]); // Adjusted route
  }

  excluirFuncionario(id: number): void { // Changed to accept id
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.funcionarioService.delete(id).pipe(
        tap(() => {
          this.funcionarios = this.funcionarios.filter(f => f.id !== id);
          // Optionally, show a success message
        }),
        catchError(err => {
          console.error('Erro ao excluir funcionário:', err);
          this.error = 'Não foi possível excluir o funcionário.';
          return of(null);
        })
      ).subscribe();
    }
  }

  navigateToNovoFuncionario(): void {
    this.router.navigate(['/admin-universidade/funcionarios/novo']); // Adjusted route
  }
}