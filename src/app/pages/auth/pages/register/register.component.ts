import { Component, DestroyRef, inject, signal } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { passwordPattern } from "../../../../core/utils/common-patterns";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { RouterLink } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";
import { firstValueFrom } from "rxjs";
import { FormErrorComponent } from "../../../../core/components/form-error/form-error.component";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    RouterLink,
    LoaderComponent,
    FormErrorComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);
  readonly #http = inject(HttpClient);
  readonly #destroyRef = inject(DestroyRef);

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

  async register() {
    if (this.form.invalid) {
      return;
    }

    try {
      this.loading.set(true);
      const res = await firstValueFrom(
        this.#http.post("auth/register", this.form.value)
      );
    } catch (error: unknown) {
      console.log(error);
    } finally {
      this.loading.set(false);
    }
  }
}
