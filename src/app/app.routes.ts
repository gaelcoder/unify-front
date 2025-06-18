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
import { ProfessorListComponent } from './components/professor/professor-list/professor-list.component';
import { ProfessorFormComponent } from './components/professor/professor-form/professor-form.component';
import { FuncionarioRHDashboardComponent } from './components/dashboard-funcionario-rh/funcionario-rh-dashboard.component';
import { DashboardSecretariaComponent } from './components/dashboard-secretaria/dashboard-secretaria.component';
import { DashboardAlunoComponent } from './components/dashboard-aluno/dashboard-aluno.component';
import { SolicitacoesSecretariaListComponent } from './components/secretaria/solicitacoes-secretaria-list/solicitacoes-secretaria-list.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/index/index.component').then(m => m.IndexComponent) },
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
    data: { roles: [UserRole.AdminUniversidade, UserRole.AdminGeral, UserRole.FuncionarioRH] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default child
      { path: 'dashboard', component: AdminUniversidadeDashboardComponent },
      { path: 'funcionarios', component: FuncionarioListComponent },
      { path: 'funcionarios/novo', component: FuncionarioFormComponent },
      { path: 'funcionarios/editar/:id', component: FuncionarioFormComponent },
      { path: 'professores', component: ProfessorListComponent },
      { path: 'professores/novo', component: ProfessorFormComponent },
      { path: 'professores/editar/:id', component: ProfessorFormComponent }
    ]
  },

  // FuncionarioRH Specific Route
  {
    path: 'painel-rh',
    component: FuncionarioRHDashboardComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.FuncionarioRH] } // Specifically for FuncionarioRH
  },

  // Professor Dashboard
  {
    path: 'professor-dashboard',
    loadComponent: () => import('./components/professor-dashboard/professor-dashboard.component').then(m => m.ProfessorDashboardComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Professor, UserRole.AdminGeral] }
  },

  // Funcionario Secretaria Dashboard
  {
    path: 'dashboard-secretaria',
    component: DashboardSecretariaComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.Funcionario] }
  },

  {
    path: 'solicitacoes-secretaria',
    component: SolicitacoesSecretariaListComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.Funcionario] }
  },

  // Aluno Dashboard
  {
    path: 'aluno/dashboard',
    component: DashboardAlunoComponent,
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno] }
  },

  // Aluno Grade Horaria
  {
    path: 'aluno/grade-horaria',
    loadComponent: () => import('./components/aluno/grade-horaria/grade-horaria.component').then(m => m.GradeHorariaComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno] }
  },

  // Aluno Solicitacoes
  {
    path: 'aluno/solicitacoes',
    loadComponent: () => import('./components/aluno/solicitacoes/solicitacao-aluno-list/solicitacao-aluno-list.component').then(m => m.SolicitacaoAlunoListComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno] }
  },
  {
    path: 'aluno/solicitacoes/nova',
    loadComponent: () => import('./components/aluno/solicitacoes/solicitacao-aluno-form/solicitacao-aluno-form.component').then(m => m.SolicitacaoAlunoFormComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno] }
  },
  {
    path: 'aluno/solicitacoes/:id',
    loadComponent: () => import('./components/aluno/solicitacoes/solicitacao-aluno-detalhe/solicitacao-aluno-detalhe.component').then(m => m.SolicitacaoAlunoDetalheComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno] }
  },

  // Rota de detalhes compartilhada
  {
    path: 'solicitacoes/detalhes/:id',
    loadComponent: () => import('./components/solicitacao-detalhes/solicitacao-detalhes.component').then(m => m.SolicitacaoDetalhesComponent),
    canActivate: [authGuard],
    data: { roles: [UserRole.Aluno, UserRole.Funcionario] }
  },

  // Funcionario Secretaria Management Area
  {
    path: 'funcionariosecretaria',
    canActivate: [authGuard],
    data: { roles: [UserRole.Funcionario] },
    children: [
      { path: '', redirectTo: 'alunos', pathMatch: 'full' },
      {
        path: 'alunos',
        loadComponent: () => import('./components/funcionario-secretaria/aluno/funcionario-secretaria-aluno-list/funcionario-secretaria-aluno-list.component').then(m => m.FuncionarioSecretariaAlunoListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'alunos/novo',
        loadComponent: () => import('./components/funcionario-secretaria/aluno/funcionario-secretaria-aluno-form/funcionario-secretaria-aluno-form.component').then(m => m.FuncionarioSecretariaAlunoFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'alunos/editar/:id',
        loadComponent: () => import('./components/funcionario-secretaria/aluno/funcionario-secretaria-aluno-form/funcionario-secretaria-aluno-form.component').then(m => m.FuncionarioSecretariaAlunoFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },

      // Graduações
      {
        path: 'graduacoes',
        loadComponent: () => import('./components/funcionario-secretaria/graduacao/funcionario-secretaria-graduacao-list/funcionario-secretaria-graduacao-list.component').then(m => m.FuncionarioSecretariaGraduacaoListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'graduacoes/novo',
        loadComponent: () => import('./components/funcionario-secretaria/graduacao/funcionario-secretaria-graduacao-form/funcionario-secretaria-graduacao-form.component').then(m => m.FuncionarioSecretariaGraduacaoFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'graduacoes/editar/:id',
        loadComponent: () => import('./components/funcionario-secretaria/graduacao/funcionario-secretaria-graduacao-form/funcionario-secretaria-graduacao-form.component').then(m => m.FuncionarioSecretariaGraduacaoFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },

      // Matérias
      {
        path: 'materias',
        loadComponent: () => import('./components/funcionario-secretaria/materia/funcionario-secretaria-materia-list/funcionario-secretaria-materia-list.component').then(m => m.FuncionarioSecretariaMateriaListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'materias/nova',
        loadComponent: () => import('./components/funcionario-secretaria/materia/funcionario-secretaria-materia-form/funcionario-secretaria-materia-form.component').then(m => m.FuncionarioSecretariaMateriaFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'materias/editar/:id',
        loadComponent: () => import('./components/funcionario-secretaria/materia/funcionario-secretaria-materia-form/funcionario-secretaria-materia-form.component').then(m => m.FuncionarioSecretariaMateriaFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },

      // Turmas
      {
        path: 'turmas',
        loadComponent: () => import('./components/funcionario-secretaria/turma-list/turma-list.component').then(m => m.TurmaListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'turmas/nova',
        loadComponent: () => import('./components/funcionario-secretaria/turma-form/turma-form.component').then(m => m.TurmaFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'turmas/editar/:id',
        loadComponent: () => import('./components/funcionario-secretaria/turma-form/turma-form.component').then(m => m.TurmaFormComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },

      // Solicitações
      {
        path: 'solicitacoes-troca-turma',
        loadComponent: () => import('./components/funcionario-secretaria/solicitacoes/solicitacoes-troca-turma-list/solicitacoes-troca-turma-list.component').then(m => m.FuncionarioSecretariaSolicitacoesTrocaTurmaListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      },
      {
        path: 'solicitacoes-transferencia-graduacao',
        loadComponent: () => import('./components/funcionario-secretaria/solicitacoes/solicitacoes-transferencia-graduacao-list/solicitacoes-transferencia-graduacao-list.component').then(m => m.FuncionarioSecretariaSolicitacoesTransferenciaGraduacaoListComponent),
        canActivate: [authGuard],
        data: { roles: [UserRole.Funcionario] }
      }
    ]
  },

  // Empty path route - matches exactly ''
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Fallback para rotas não encontradas - redireciona para home
  // { path: '**', redirectTo: '/home' } // Temporarily commented out for diagnostics
];