import { Component, DestroyRef, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { PasswordFieldComponent } from "../../components/password-field/password-field.component";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { passwordPattern } from "../../../../core/utils/common-patterns";
import { RouterLink } from "@angular/router";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";
import { AuthHttpService } from "../../services/auth-http.service";
import { ToastrService } from "ngx-toastr";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormErrorComponent } from "../../../../core/components/form-error/form-error.component";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import {
  attachServerErrorsToForm,
  ServerValidationError,
} from "../../../../core/utils/form-helpers";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    RouterLink,
    LoaderComponent,
    FormErrorComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  readonly #fb = inject(FormBuilder);
  readonly #authHttpService = inject(AuthHttpService);
  readonly #toastr = inject(ToastrService);
  readonly #destroyRef = inject(DestroyRef);

  protected emailVerified = signal(true);
  protected loading = signal(false);

  protected form = this.#fb.nonNullable.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(passwordPattern)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.#toastr.error("Invalid form data");
      return;
    }

    this.loading.set(true);
    this.emailVerified.set(true);
    this.#authHttpService
      .login(
        this.form.value.email as string,
        this.form.value.password as string
      )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: ({ status, error }: HttpErrorResponse) => {
          if (status === HttpStatusCode.UnprocessableEntity) {
            attachServerErrorsToForm(
              this.form,
              error.error as ServerValidationError[],
              this.#destroyRef
            );
          }
          if (status === HttpStatusCode.NotAcceptable) {
            this.emailVerified.set(false);
          }

          switch (status) {
            case HttpStatusCode.UnprocessableEntity:
              attachServerErrorsToForm(
                this.form,
                error.error as ServerValidationError[],
                this.#destroyRef
              );
              break;
            case HttpStatusCode.NotAcceptable:
              this.emailVerified.set(false);
              break;
            case HttpStatusCode.BadRequest:
              this.#toastr.error(error.message);
              break;
            default:
              this.#toastr.error(
                "Something went wrong. Please try again later."
              );
          }
        },
      })
      .add(() => this.loading.set(false));
  }
}
