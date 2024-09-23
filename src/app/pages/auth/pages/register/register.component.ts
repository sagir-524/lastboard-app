import { Component, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RegistrationFormComponent } from "./registration-form/registration-form.component";
import { RegistrationSuccessComponent } from "./registration-success/registration-success.component";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    MatCardModule,
    RegistrationFormComponent,
    RegistrationSuccessComponent,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.scss",
})
export class RegisterComponent {
  registeredEmail = signal<string | undefined>(undefined);
}
