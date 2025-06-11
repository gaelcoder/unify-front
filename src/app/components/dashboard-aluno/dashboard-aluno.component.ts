import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-aluno',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-aluno.component.html',
  styleUrl: './dashboard-aluno.component.css'
})
export class DashboardAlunoComponent {
  
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
