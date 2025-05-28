import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue;
  
  console.log('JWT Interceptor - Request URL:', req.url);
  console.log('JWT Interceptor - Current User:', currentUser);
  
  // Only add token for API requests
  if (req.url.includes('/api/')) {
    if (currentUser && currentUser.token) {
      console.log('JWT Interceptor - Adding token to API request');
      
      let headersToSet: { [name: string]: string | string[] } = {
        Authorization: `Bearer ${currentUser.token}`
      };

      // Only set Content-Type if the body is not FormData
      if (!(req.body instanceof FormData)) {
        headersToSet['Content-Type'] = 'application/json';
      }

      req = req.clone({
        setHeaders: headersToSet
      });
    } else {
      console.warn('JWT Interceptor - No token available for API request');
    }
  }
  
  // Log the final request headers
  console.log('JWT Interceptor - Final request headers:', req.headers);
  
  return next(req);
};