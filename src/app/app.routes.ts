import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'universidades', component: UniversidadeListComponent },
  { path: 'universidades/novo', component: UniversidadeFormComponent },
  { path: 'universidades/editar/:id', component: UniversidadeFormComponent },
  { path: 'representantes', component: RepresentanteListComponent },
  { path: 'representantes/novo', component: RepresentanteFormComponent },
  { path: 'representantes/editar/:id', component: RepresentanteFormComponent },
  // Rota curinga para página não encontrada
  { path: '**', redirectTo: '' }
];