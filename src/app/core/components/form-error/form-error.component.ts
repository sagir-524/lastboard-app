import {
  Component,
  computed,
  input,
  OnInit,
  signal,
  DestroyRef,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { map, merge, startWith, tap } from "rxjs";
import { FormErrorMessage } from "./form-error-message.type";

@Component({
  selector: "app-form-error",
  standalone: true,
  imports: [],
  templateUrl: "./form-error.component.html",
  styleUrl: "./form-error.component.scss",
})
export class FormErrorComponent implements OnInit {
  control = input.required<AbstractControl>();
  submitted = input<boolean>(false);
  messages = input.required<FormErrorMessage[]>();

  #destroyRef = inject(DestroyRef);
  #errors = signal<ValidationErrors | null>(null);

  protected error = computed(() => {
    const errors = this.#errors();
    const messages = this.messages();
    return messages.find(({ name }) => errors && name in errors)?.message;
  });

  ngOnInit(): void {
    const control = this.control();

    merge(
      control.valueChanges.pipe(startWith(control.value)),
      control.statusChanges.pipe(startWith(control.status))
    )
      .pipe(
        startWith(control.value),
        map(() => control.errors),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((errors) => this.#errors.set(errors));
  }
}
