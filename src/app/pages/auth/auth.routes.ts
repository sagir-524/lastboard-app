import { Routes } from "@angular/router";
import { AuthHttpService } from "./services/auth.service";

export const authRoutes: Routes = [
  {
    path: "auth",
    loadComponent: () =>
      import("./auth.component").then((c) => c.AuthComponent),
    providers: [AuthHttpService],
    children: [
      {
        path: "register",
        loadComponent: () =>
          import("./pages/register/register.component").then(
            (c) => c.RegisterComponent
          ),
      },
      {
        path: "login",
        loadComponent: () =>
          import("./pages/login/login.component").then((c) => c.LoginComponent),
      },
    ],
  },
];
