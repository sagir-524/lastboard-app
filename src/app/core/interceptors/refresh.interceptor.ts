import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthStore } from "../../pages/auth/stores/auth.store";
import { catchError, first, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        return authStore.refresh().pipe(
          first(),
          switchMap((refreshed) => {
            if (!refreshed) {
              router.navigateByUrl("/auth/login");
              return throwError(() => error);
            } else {
              return next(req);
            }
          })
        );
      } else {
        return throwError(() => error);
      }
    })
  );
};
