import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'universidades', component: UniversidadeListComponent },
  { path: 'universidades/novo', component: UniversidadeFormComponent },
  { path: 'representantes', component: RepresentanteListComponent },
  { path: 'representantes/novo', component: RepresentanteFormComponent },
   { path: 'universidades/editar/:id', component: UniversidadeFormComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
