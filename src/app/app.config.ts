import { ApplicationConfig } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { provideNgxMask } from 'ngx-mask';
// Importe outros providers conforme necessário

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideNgxMask()
    // Adicione outros providers conforme necessário
  ]
};
