import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl } from "@angular/forms";
import { first } from "rxjs";

export type ServerValidationError = {
  field: string;
  message: string;
  rule: string;
};

export const attachServerErrorToField = (
  control: AbstractControl,
  error: ServerValidationError,
  destroyRef: DestroyRef
): void => {
  const errors = structuredClone(control.errors || {});
  errors[error.rule] = error.message;

  control.setErrors(errors);
  control.valueChanges
    .pipe(first(), takeUntilDestroyed(destroyRef))
    .subscribe(() => {
      control.setErrors(null);
      control.updateValueAndValidity();
    });
};

export const attachServerErrorsToForm = (
  form: AbstractControl,
  errors: ServerValidationError[],
  destroyRef: DestroyRef
): void => {
  for (let error of errors) {
    const control = form.get(error.field);

    if (!control) {
      continue;
    }

    attachServerErrorToField(control, error, destroyRef);
  }
};
