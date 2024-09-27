import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { inject } from "@angular/core";
import { AuthStore } from "../../pages/auth/stores/auth.store";
import { catchError, switchMap, tap, throwError } from "rxjs";
import { Router } from "@angular/router";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  req = req.clone({
    url: environment.apiUrl + req.url,
    setHeaders: authStore.token()
      ? { Authorization: `Bearer ${authStore.token()}` }
      : undefined,
  });

  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      if (
        errorResponse.status === HttpStatusCode.Unauthorized &&
        authStore.refreshToken()
      ) {
        return authStore.refresh().pipe(
          switchMap((refreshed) => {
            if (!refreshed) {
              authStore.logout()
              router.navigateByUrl("/auth/login");
              return throwError(() => errorResponse);
            } else {
              return next(req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authStore.token()}`
                }
              }));
            }
          })
        );
      }

      
      return throwError(() => errorResponse);
    })
  );
};
