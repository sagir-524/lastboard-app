import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { httpInterceptor } from "./core/interceptors/http.interceptor";
import { provideToastr } from "ngx-toastr";
import { tokenInterceptor } from "./core/interceptors/token.interceptor";
import { refreshInterceptor } from "./core/interceptors/refresh.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([httpInterceptor, tokenInterceptor, refreshInterceptor])
    ),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideToastr(),
  ],
};
