import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { passwordPatter } from "../../../../utils/pattersn";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, PasswordFieldComponent],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);

  form = this.#fb.nonNullable.group(
    {
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(passwordPatter)]],
      password_confirmation: ["", [Validators.required]],
    },
    {
      validators: ({ value }: AbstractControl<any>) => {
        if (value.password !== value.password_confirmation) {
          return { passwordConfirmation: true };
        }

        return null;
      }
    }
  );
}
