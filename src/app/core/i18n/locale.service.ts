import { Injectable, computed, signal } from '@angular/core';
import { AppLocale } from './locale.model';
import { Currency } from '../../features/subscriptions/subscription.model';

const STORAGE_KEY = 'subwise.locale';
const CURRENCY_ORDER: Currency[] = ['RUB', 'USD', 'EUR'];

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly localeSignal = signal<AppLocale>(this.getInitialLocale());

  readonly locale = this.localeSignal.asReadonly();
  readonly intlLocale = computed(() => this.localeSignal() === 'ru' ? 'ru-RU' : 'en-US');

  constructor() {
    this.syncDocumentLanguage(this.localeSignal());
  }

  setLocale(locale: AppLocale) {
    this.localeSignal.set(locale);
    this.syncDocumentLanguage(locale);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }

  formatMoney(amount: number, currency: Currency = 'RUB'): string {
    return new Intl.NumberFormat(this.intlLocale(), {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  }

  formatMoneyBreakdown(entries: Array<{ amount: number; currency: Currency }>): string {
    const totals = new Map<Currency, number>();

    for (const entry of entries) {
      if (!entry.amount) {
        continue;
      }

      totals.set(entry.currency, (totals.get(entry.currency) || 0) + entry.amount);
    }

    const parts = CURRENCY_ORDER
      .map((currency) => {
        const amount = totals.get(currency);
        return amount ? this.formatMoney(amount, currency) : null;
      })
      .filter((value): value is string => Boolean(value));

    return parts.length > 0 ? parts.join(' / ') : '0';
  }

  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat(this.intlLocale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(typeof date === 'string' ? new Date(date) : date);
  }

  getDaysLabel(days: number): string {
    return this.localeSignal() === 'ru'
      ? this.getRussianDaysLabel(days)
      : Math.abs(days) === 1 ? 'day' : 'days';
  }

  private getInitialLocale(): AppLocale {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en') {
        return saved;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
      return 'en';
    }

    return 'ru';
  }

  private syncDocumentLanguage(locale: AppLocale) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }

  private getRussianDaysLabel(days: number): string {
    const absDays = Math.abs(days);
    const lastDigit = absDays % 10;
    const lastTwoDigits = absDays % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'дней';
    }

    if (lastDigit === 1) {
      return 'день';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'дня';
    }

    return 'дней';
  }
}
