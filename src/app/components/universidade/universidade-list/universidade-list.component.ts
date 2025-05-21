import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UniversidadeService } from '../../../services/universidade.service';
import { Universidade } from '../../../models/universidade.model';

@Component({
  selector: 'app-universidade-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
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
}
