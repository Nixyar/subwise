import { Inject, Injectable, Optional } from '@angular/core';
import { MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

export const SUBSCRIPTION_DATE_FORMATS = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

@Injectable()
export class SubscriptionDateAdapter extends NativeDateAdapter {
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) matDateLocale?: string) {
    super(matDateLocale);
  }

  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }

      const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(trimmed);
      if (match) {
        const [, dayText, monthText, yearText] = match;
        const day = Number(dayText);
        const month = Number(monthText) - 1;
        const year = Number(yearText);
        const result = new Date(year, month, day);

        if (
          result.getFullYear() === year &&
          result.getMonth() === month &&
          result.getDate() === day
        ) {
          return result;
        }

        return null;
      }
    }

    const timestamp = typeof value === 'number' ? value : Date.parse(String(value));
    return Number.isNaN(timestamp) ? null : new Date(timestamp);
  }

  override format(date: Date, displayFormat: unknown): string {
    if (displayFormat === 'input') {
      const day = `${date.getDate()}`.padStart(2, '0');
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    return super.format(date, displayFormat as object);
  }
}
