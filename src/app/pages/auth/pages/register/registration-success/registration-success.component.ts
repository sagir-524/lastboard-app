import { Component, input } from "@angular/core";
import { ResendVerificationMailComponent } from "../../../components/resend-verification-mail/resend-verification-mail.component";

@Component({
  selector: "app-registration-success",
  standalone: true,
  imports: [ResendVerificationMailComponent],
  templateUrl: "./registration-success.component.html",
  styleUrl: "./registration-success.component.scss",
})
export class RegistrationSuccessComponent {
  email = input.required<string>();
}
