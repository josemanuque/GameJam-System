import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  //console.log(`Bearer ${authService.getToken()}`);
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`
    }
  });
  return next(req);
};

