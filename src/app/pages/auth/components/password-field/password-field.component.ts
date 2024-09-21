import { Component, input, signal } from "@angular/core";
import { ReactiveFormsModule, type FormControl } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-password-field",
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: "./password-field.component.html",
  styleUrl: "./password-field.component.scss",
})
export class PasswordFieldComponent {
  control = input.required<FormControl<string>>();
  protected inputType = signal<"text" | "password">("password");

  toggleInputType(): void {
    this.inputType.update((value) => {
      return value === "text" ? "password" : "text";
    });
  }
}
