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
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";
import { firstValueFrom } from "rxjs";
import { FormErrorComponent } from "../../../../core/components/form-error/form-error.component";
import { NgIf } from "@angular/common";
import {
  attachServerErrorsToForm,
  ServerValidationError,
} from "../../../../core/utils/form-helpers";
import { ToastrService } from "ngx-toastr";

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
    NgIf,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  readonly #fb = inject(FormBuilder);
  readonly #http = inject(HttpClient);
  readonly #destroyRef = inject(DestroyRef);
  readonly #toastr = inject(ToastrService);

  protected loading = signal<boolean>(false);
  protected registered = signal<boolean>(false);

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
    // if (this.form.invalid) {
    //   return;
    // }

    this.loading.set(true);
    this.#http
      .post("auth/register", this.form.value)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.registered.set(true),
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
