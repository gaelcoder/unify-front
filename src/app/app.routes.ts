import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
// Remova os imports que não existem
import { authGuard } from './guards/auth.guard';

// Componentes existentes
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { TrocarSenhaComponent } from './components/trocarsenha/trocarsenha.component';


export const routes: Routes = [
  // Login como página inicial
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'trocar-senha', component: TrocarSenhaComponent },
 
  // A rota trocar-senha será adicionada quando o componente for criado
  
  // Rotas protegidas para admin geral (usando componentes existentes)
  {
    path: 'representantes',
    component: RepresentanteListComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  {
    path: 'representantes/novo',
    component: RepresentanteFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  {
    path: 'representantes/editar/:id',
    component: RepresentanteFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  {
    path: 'universidades',
    component: UniversidadeListComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  {
    path: 'universidades/nova',
    component: UniversidadeFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  {
    path: 'universidades/editar/:id',
    component: UniversidadeFormComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_ADMIN_GERAL'] }
  },
  
  // Redirecionar qualquer rota não encontrada para login
  { path: '**', redirectTo: '' }
];