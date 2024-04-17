import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  console.log(`Bearer ${authService.getToken()}`);
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`
    }
  });
  return next(req);
};

