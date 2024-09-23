import { Component, DestroyRef, inject, input, signal } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, interval, take } from "rxjs";
import { AuthHttpService } from "../../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { LoaderComponent } from "../../../../../core/components/loader/loader.component";

@Component({
  selector: "app-registration-success",
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: "./registration-success.component.html",
  styleUrl: "./registration-success.component.scss",
})
export class RegistrationSuccessComponent {
  readonly #destroyRef = inject(DestroyRef);
  readonly #countDown$ = new BehaviorSubject(0);
  readonly #authHttpService = inject(AuthHttpService);
  readonly #toastr = inject(ToastrService);

  email = input.required<string>();

  protected readonly loading = signal(false);
  protected readonly countDown = toSignal(this.#countDown$);

  startCountDown() {
    this.#countDown$.next(10);
    interval(1000)
      .pipe(take(10), takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#countDown$.next(this.#countDown$.value - 1);
      });
  }

  resendVerificationEmail(): void {
    this.loading.set(true);
    this.#authHttpService
      .resendVerificationMail(this.email())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#toastr.success("Your verification email is resent.");
          this.startCountDown();
        },
        error: () => {
          this.#toastr.error("Something went wrong. Please try again later.");
        },
      })
      .add(() => this.loading.set(false));
  }
}
