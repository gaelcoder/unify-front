import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grade-horaria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Grade Horária</h2>
      <p>Funcionalidade de geração de grade horária em desenvolvimento.</p>
    </div>
  `
})
export class GradeHorariaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} 