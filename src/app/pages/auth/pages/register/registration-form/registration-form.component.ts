import { Component, DestroyRef, inject, model, signal } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { passwordPattern } from "../../../../../core/utils/common-patterns";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import {
  attachServerErrorsToForm,
  ServerValidationError,
} from "../../../../../core/utils/form-helpers";
import { ToastrService } from "ngx-toastr";
import { FormErrorComponent } from "../../../../../core/components/form-error/form-error.component";
import { PasswordFieldComponent } from "../../../components/password-field/password-field.component";
import { LoaderComponent } from "../../../../../core/components/loader/loader.component";
import { RouterLink } from "@angular/router";
import { AuthHttpService } from "../../../services/auth-http.service";
import { RegistrationRequestBody } from "../../../types/registration-request-body.type";

@Component({
  selector: "app-registration-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormErrorComponent,
    PasswordFieldComponent,
    LoaderComponent,
    RouterLink,
  ],
  templateUrl: "./registration-form.component.html",
  styleUrl: "./registration-form.component.scss",
})
export class RegistrationFormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #authHttpService = inject(AuthHttpService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #toastr = inject(ToastrService);

  registeredEmail = model<string | undefined>(undefined);

  protected loading = signal(false);

  protected form = this.#fb.nonNullable.group({
    firstname: ["", Validators.required],
    lastname: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
    password_confirmation: [
      "",
      [
        Validators.required,
        ({ value, parent }: AbstractControl) => {
          const password = parent?.get("password")?.value;

          if (password && password !== value) {
            return { sameAs: true };
          }

          return null;
        },
      ],
    ],
  });

  constructor() {
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.controls.password_confirmation.updateValueAndValidity();
      });
  }

  async register() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.#authHttpService
      .register(this.form.value as RegistrationRequestBody)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.registeredEmail.set(this.form.value.email),
        error: ({ status, error }: HttpErrorResponse) => {
          if (status === HttpStatusCode.UnprocessableEntity) {
            const errors = error.errors as ServerValidationError[];
            attachServerErrorsToForm(this.form, errors, this.#destroyRef);
          } else {
            this.#toastr.error(
              "Something went wrong. Please try again later.",
              "Error"
            );
          }
        },
      })
      .add(() => this.loading.set(false));
  }
}
