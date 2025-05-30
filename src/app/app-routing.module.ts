import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TrocarSenhaComponent } from './components/trocarsenha/trocarsenha.component';
import { authGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';
import { AdminGeralDashboardComponent } from './components/dashboard-admin-geral/dashboard-admin-geral.component';
import { AdminUniversidadeDashboardComponent } from './components/dashboard-admin-universidade/dashboard-admin-universidade.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './components/funcionario/funcionario-form/funcionario-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'trocar-senha', component: TrocarSenhaComponent }, // Assuming it can be accessed if token is valid, guard might be inside component

  // Admin Geral
  { path: 'dashboard-admin-geral', component: AdminGeralDashboardComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'universidades', component: UniversidadeListComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'universidades/nova', component: UniversidadeFormComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'universidades/editar/:id', component: UniversidadeFormComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'representantes', component: RepresentanteListComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'representantes/novo', component: RepresentanteFormComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },
  { path: 'representantes/editar/:id', component: RepresentanteFormComponent, canActivate: [authGuard], data: { roles: [UserRole.AdminGeral] } },

  // Admin Universidade
  {
    path: 'admin-universidade/dashboard',
    component: AdminUniversidadeDashboardComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral] }
  },
  {
    path: 'admin-universidade/funcionarios',
    component: FuncionarioListComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral] }
  },
  {
    path: 'admin-universidade/funcionarios/novo',
    component: FuncionarioFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral] }
  },
  {
    path: 'admin-universidade/funcionarios/editar/:id',
    component: FuncionarioFormComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral] }
  },

  // Fallback
  { path: '**', redirectTo: '/home' } // Or a 404 component
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    console.log('[AppRoutingModule] Constructor - Router tracing should be enabled.');
  }
} 