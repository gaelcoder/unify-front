import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { inject } from '@angular/core'; // Not strictly needed if only using localStorage
// import { AuthService } from '../services/auth.service'; // Not strictly needed if only using localStorage

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  console.log('[JWT Interceptor] Intercepting request:', req.url, req.method);

  const storedUserItem = localStorage.getItem('currentUser');
  const parsedUser = storedUserItem ? JSON.parse(storedUserItem) : null;
  const token = parsedUser ? parsedUser.token : null;

  console.log('[JWT Interceptor] Stored User Item:', storedUserItem);
  console.log('[JWT Interceptor] Parsed User:', parsedUser);
  console.log('[JWT Interceptor] Token Extracted:', token);

  const excludedPaths = [
    '/api/auth/login',
    '/api/auth/registrar',
    '/api/auth/refresh-token',
    // Add any other public API endpoints here
  ];

  // Updated check for API URL to handle both relative and absolute paths to the backend API
  const isApiUrl = req.url.startsWith('/api/') || req.url.startsWith('http://localhost:8080/api/');
  const isExcludedPath = excludedPaths.some(path => req.url.includes(path));
  const shouldAttachToken = isApiUrl && !isExcludedPath;

  console.log('[JWT Interceptor] Is API URL?', isApiUrl);
  console.log('[JWT Interceptor] Is Excluded Path?', isExcludedPath);
  console.log('[JWT Interceptor] Should Attach Token?', shouldAttachToken);

  let headersToSet: { [name: string]: string | string[] } = {};
  let requestToModify = req;

  if (token && shouldAttachToken) {
    console.log('[JWT Interceptor] Attaching token to request for:', req.url);
    headersToSet['Authorization'] = `Bearer ${token}`;
  } else if (!token && shouldAttachToken) {
    console.warn('[JWT Interceptor] No token available to attach for secured API request to:', req.url);
  } else if (token && !shouldAttachToken) {
    console.log('[JWT Interceptor] Token present, but not attaching for URL (e.g. excluded or not API):', req.url);
  }

  // More specific Content-Type handling for POST/PUT/PATCH with non-FormData body
  if (!(req.body instanceof FormData) && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
    if (!req.headers.has('Content-Type')) {
      console.log('[JWT Interceptor] Setting Content-Type to application/json for:', req.url);
      headersToSet['Content-Type'] = 'application/json';
    }
  }
  
  if (Object.keys(headersToSet).length > 0) {
    requestToModify = req.clone({ setHeaders: headersToSet });
    console.log('[JWT Interceptor] Request cloned with new headers for:', req.url, requestToModify.headers.get('Authorization'));
  } else {
    console.log('[JWT Interceptor] No headers modified for:', req.url);
  }

  return next(requestToModify);
};

// Ensure the class-based interceptor below this line is REMOVED from this file.
// @Injectable()
// export class JwtInterceptor implements HttpInterceptor { ... } // DELETE THIS CLASS