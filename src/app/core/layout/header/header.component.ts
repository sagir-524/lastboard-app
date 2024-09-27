import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthStore } from "../../../pages/auth/stores/auth.store";
import { MatIconModule } from "@angular/material/icon";
import {
  DropdownContainerDirective,
  DropdownDirective,
  DropdownTriggerDirective,
} from "../../../ui/directives/dropdown.directive";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    DropdownContainerDirective,
    DropdownDirective,
    DropdownTriggerDirective,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  readonly #authStore = inject(AuthStore);

  protected readonly loggedIn = this.#authStore.loggedIn;
  protected readonly user = this.#authStore.user;
}
