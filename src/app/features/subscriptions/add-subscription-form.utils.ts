import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startOfDay(value: Date): Date {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function parseDateValue(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return startOfDay(value);
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
  }

  return null;
}

export function createNotInPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selected = parseDateValue(control.value);
    if (!selected) {
      return null;
    }

    const today = startOfDay(new Date());
    return selected < today ? { pastDate: true } : null;
  };
}
