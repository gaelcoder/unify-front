import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';
import { MinhasNotasComponent } from './components/minhas-notas/minhas-notas.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UniversidadeListComponent,
    UniversidadeFormComponent,
    RepresentanteListComponent,
    RepresentanteFormComponent,
    MinhasNotasComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
