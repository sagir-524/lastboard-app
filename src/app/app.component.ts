import { Component, inject } from "@angular/core";
import { MAT_CARD_CONFIG } from "@angular/material/card";
import { RouterOutlet } from "@angular/router";
import { AuthStore } from "./pages/auth/stores/auth.store";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [
    { provide: MAT_CARD_CONFIG, useValue: { appearance: "outlined" } },
  ],
})
export class AppComponent {
  protected readonly authStore = inject(AuthStore)
}
