import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "../../pages/auth/stores/auth.store";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, map } from "rxjs";

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.loading).pipe(
    filter((loading) => !loading),
    map(() => {
      return authStore.loggedIn() || router.createUrlTree(["/auth", "login"]);
    })
  );
};
