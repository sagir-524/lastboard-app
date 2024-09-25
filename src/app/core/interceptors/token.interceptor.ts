import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../pages/auth/stores/auth.store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  
  if (authStore.token()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authStore.token()}`
      }
    })
  }

  return next(req);
};