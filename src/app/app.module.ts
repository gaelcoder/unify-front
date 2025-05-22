import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors} from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { UniversidadeListComponent } from './components/universidade/universidade-list/universidade-list.component';
import { UniversidadeFormComponent } from './components/universidade/universidade-form/universidade-form.component';
import { RepresentanteListComponent } from './components/representante/representante-list/representante-list.component';
import { RepresentanteFormComponent } from './components/representante/representante-form/representante-form.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    UniversidadeListComponent,
    UniversidadeFormComponent,
    RepresentanteListComponent,
    RepresentanteFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClient,
    ReactiveFormsModule
  ],
   providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
