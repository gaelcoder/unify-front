import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';

// Componentes existentes e novos
import { HomeComponent } from './components/home/home.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { TrocarSenhaComponent } from './components/trocarsenha/trocarsenha.component';
import { AdminGeralDashboardComponent } from './components/dashboard-admin-geral/dashboard-admin-geral.component';
import { AdminUniversidadeDashboardComponent } from './components/dashboard-admin-universidade/dashboard-admin-universidade.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'trocar-senha', component: TrocarSenhaComponent },

  // Home (página inicial protegida)
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  // Admin Geral
  {
    path: 'dashboard-admin-geral',
    component: AdminGeralDashboardComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'representantes',
    component: RepresentanteListComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'representantes/novo',
    component: RepresentanteFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'representantes/editar/:id',
    component: RepresentanteFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'universidades',
    component: UniversidadeListComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'universidades/nova',
    component: UniversidadeFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },
  {
    path: 'universidades/editar/:id',
    component: UniversidadeFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminGeral] }
  },

  // Admin Universidade
  {
    path: 'admin-universidade', // Parent path
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default child
      { path: 'dashboard', component: AdminUniversidadeDashboardComponent },
      { path: 'funcionarios', component: FuncionarioListComponent },
      { path: 'funcionarios/novo', component: FuncionarioFormComponent },
      { path: 'funcionarios/editar/:id', component: FuncionarioFormComponent }
    ]
  },

  // Empty path route - matches exactly ''
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Fallback para rotas não encontradas - redireciona para home
  { path: '**', redirectTo: '/home' }
];