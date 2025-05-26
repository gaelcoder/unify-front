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
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.warn('JWT Interceptor - No token available for API request');
    }
  }
  
  // Log the final request headers
  console.log('JWT Interceptor - Final request headers:', req.headers);
  
  return next(req);
};