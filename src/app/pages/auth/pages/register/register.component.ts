import { Component, inject, signal } from "@angular/core";
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
import { HttpClient } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);
  readonly #http = inject(HttpClient);
  protected loading = signal<boolean>(false);

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

  register() {
    this.loading.set(true);

    // this.#http
    //   .post("auth/register", this.form.value)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     },
    //   });
  }
}
