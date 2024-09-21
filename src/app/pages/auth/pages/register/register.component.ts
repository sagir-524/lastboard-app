import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { passwordPattern } from "../../../../utils/pattersn";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    RouterLink,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);

  protected form = this.#fb.nonNullable.group(
    {
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
      password_confirmation: ["", [Validators.required]],
    },
    {
      validators: ({ value }: AbstractControl<any>) => {
        if (value.password !== value.password_confirmation) {
          return { passwordConfirmation: true };
        }

        return null;
      },
    }
  );
}
