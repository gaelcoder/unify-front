import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RepresentanteService } from '../../../services/representante.service';
import { Representante } from '../../../models/representante.model';

@Component({
  selector: 'app-representante-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Adicione CommonModule aqui
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
    this.representanteService.getAll().subscribe({
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
}
