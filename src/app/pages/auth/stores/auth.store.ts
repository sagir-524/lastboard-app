import { computed, inject, PLATFORM_ID } from "@angular/core";
import { User } from "../types/user.type";
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from "@ngrx/signals";
import { HttpClient } from "@angular/common/http";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { catchError, filter, of, switchMap } from "rxjs";
import { TokenResponse } from "../types/token-response.type";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";

type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  refreshing: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  refreshing: false,
};

export const AuthStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withComputed(({ token, refreshToken, user }) => ({
    loggedIn: computed(() => !!token() && !!refreshToken() && !!user()),
    _primaryState: computed(() => ({
      token: token(),
      refreshToken: refreshToken(),
      user: user(),
    })),
  })),
  withMethods(
    (
      store,
      http = inject(HttpClient),
      document = inject(DOCUMENT),
      platformId = inject(PLATFORM_ID)
    ) => ({
      _getTokenFromStorage: () => {
        if (
          isPlatformBrowser(platformId) &&
          document.defaultView?.localStorage
        ) {
          const localStorage = document.defaultView.localStorage;
          const token = localStorage.getItem("_lb_token");
          const refreshToken = localStorage.getItem("_lb_refresh_token");

          if (token && refreshToken) {
            patchState(store, { token, refreshToken });
          }
        }
      },
      _loadUserIfNotLoader: () => {
        toObservable(store._primaryState)
          .pipe(
            switchMap(({ user, token, refreshToken }) => {
              patchState(store, { loading: true });
              if (token && refreshToken && !user) {
                return http
                  .get<User>("auth/user")
                  .pipe(catchError(() => of(null)));
              }

              return of(user);
            })
          )
          .pipe(takeUntilDestroyed())
          .subscribe((user) => patchState(store, { user, loading: false }));
      },
      login: (user: User, token: string, refreshToken: string) => {
        if (
          isPlatformBrowser(platformId) &&
          document.defaultView?.localStorage
        ) {
          const localStorage = document.defaultView.localStorage;
          localStorage.setItem("_lb_token", token);
          localStorage.setItem("_lb_refresh_token", refreshToken);
        }

        patchState(store, { user, token, refreshToken });
      },
      logout: (localStorage: Storage) => {
        if (
          isPlatformBrowser(platformId) &&
          document.defaultView?.localStorage
        ) {
          const localStorage = document.defaultView.localStorage;
          localStorage.removeItem("_lb_token");
          localStorage.removeItem("_lb_refresh_token");
        }
        patchState(store, { user: null, token: null, refreshToken: null });
      },
      refresh: () => {
        if (!store.refreshToken) {
          return of(false);
        }

        if (store.refreshing()) {
          return toObservable(store.refreshing).pipe(
            filter((refreshing) => !refreshing),
            switchMap(() => of(store.loggedIn()))
          );
        } else {
          patchState(store, { refreshing: true });
          return http
            .post<TokenResponse>("auth/refresh", {
              refreshToken: store.refreshToken(),
            })
            .pipe(
              switchMap(({ user, token, refreshToken }) => {
                patchState(store, { user, token, refreshToken, refreshing: false });
                return of(store.loggedIn());
              }),
              catchError(() => of(false))
            );
        }
      },
    })
  ),
  withHooks((store, http = inject(HttpClient)) => ({
    onInit: () => {
      store._getTokenFromStorage();
      store._loadUserIfNotLoader();
    },
  }))
);
