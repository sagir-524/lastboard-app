import { Component, inject, signal, Signal } from "@angular/core";
import { AuthHttpService } from "../../services/auth.service";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LoaderComponent } from "../../../../core/components/loader/loader.component";
import { catchError, map, of } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { ResendVerificationMailComponent } from "../../components/resend-verification-mail/resend-verification-mail.component";

type VerificationData = {
  verified: boolean;
  resendable: boolean;
  message?: string;
};

@Component({
  selector: "app-verify-email",
  standalone: true,
  imports: [LoaderComponent, RouterLink, ResendVerificationMailComponent],
  templateUrl: "./verify-email.component.html",
  styleUrl: "./verify-email.component.scss",
})
export class VerifyEmailComponent {
  readonly #authHttpService = inject(AuthHttpService);
  readonly #route = inject(ActivatedRoute);

  protected readonly email = signal(
    this.#route.snapshot.params["email"] as string
  );
  protected readonly token = signal(
    this.#route.snapshot.params["token"] as string
  );

  protected readonly data: Signal<VerificationData | undefined> = toSignal(
    this.#authHttpService.verifyEmail(this.token()).pipe(
      map(
        () => ({ verified: true, resendable: false } satisfies VerificationData)
      ),
      catchError((error: HttpErrorResponse) => {
        let data: VerificationData;

        if (error.status === HttpStatusCode.BadRequest) {
          data = {
            verified: false,
            resendable: true,
            message: error.error?.message || "",
          };
        } else {
          data = {
            verified: false,
            resendable: false,
            message: "Something went wrong. Please try again later.",
          };
        }

        return of(data);
      })
    )
  );
}
