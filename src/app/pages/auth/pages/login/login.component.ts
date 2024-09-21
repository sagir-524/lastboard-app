import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { passwordPattern } from "../../../../utils/pattersn";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, PasswordFieldComponent, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  readonly #fb = inject(FormBuilder);

  protected form = this.#fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
  });
}
