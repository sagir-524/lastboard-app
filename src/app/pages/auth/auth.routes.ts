import { Routes } from "@angular/router";
import { AuthHttpService } from "./services/auth-http.service";
import { guestGuard } from "../../core/guards/guest.guard";

export const authRoutes: Routes = [
  {
    path: "auth",
    loadComponent: () =>
      import("./auth.component").then((c) => c.AuthComponent),
    providers: [AuthHttpService],
    children: [
      {
        path: "register",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./pages/register/register.component").then(
            (c) => c.RegisterComponent
          ),
      },
      {
        path: "login",
        canActivate: [guestGuard],
        loadComponent: () =>
          import("./pages/login/login.component").then((c) => c.LoginComponent),
      },
      {
        path: "verify-email/:email/:token",
        loadComponent: () =>
          import("./pages/verify-email/verify-email.component").then(
            (c) => c.VerifyEmailComponent
          ),
      },
    ],
  },
];
