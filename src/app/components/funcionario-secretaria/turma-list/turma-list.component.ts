import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Turma } from '../../../models/turma.model';
import { TurmaService } from '../../../core/services/turma.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-turma-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turma-list.component.html',
  styleUrls: ['./turma-list.component.css']
})
export class TurmaListComponent implements OnInit {
  turmas: Turma[] = [];

  constructor(private turmaService: TurmaService, private router: Router) { }

  ngOnInit(): void {
    this.loadTurmas();
  }

  loadTurmas(): void {
    this.turmaService.getTurmas().subscribe((data: Turma[]) => {
      this.turmas = data;
    });
  }

  deleteTurma(id: number): void {
    if (confirm('Tem certeza que deseja deletar esta turma?')) {
      this.turmaService.deleteTurma(id).subscribe(() => {
        this.loadTurmas();
      });
    }
  }

  editTurma(id: number): void {
    this.router.navigate(['/funcionariosecretaria/turmas/editar', id]);
  }

  createTurma(): void {
    this.router.navigate(['/funcionariosecretaria/turmas/nova']);
  }
} 