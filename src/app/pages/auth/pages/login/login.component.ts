import { Component, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { passwordPattern } from "../../../../core/utils/common-patterns";
import { RouterLink } from "@angular/router";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    RouterLink,
    LoaderComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  protected loading = signal<boolean>(false);
  readonly #fb = inject(FormBuilder);

  protected form = this.#fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
  });
}
