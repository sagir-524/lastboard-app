import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    url: environment.apiUrl + req.url,
  });

  return next(cloned);
};
