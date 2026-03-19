import { Injectable, computed, inject, signal } from '@angular/core';
import { AppLocale } from './locale.model';
import { Currency } from '../../features/subscriptions/subscription.model';
import { ExchangeRateService } from '../currency/exchange-rate.service';

const STORAGE_KEY = 'subwise.locale';
const DISPLAY_CURRENCY_KEY = 'subwise.displayCurrency';

export const DISPLAY_CURRENCIES: { code: Currency; symbol: string }[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'RUB', symbol: '₽' },
];

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly exchangeRateService = inject(ExchangeRateService);

  private readonly localeSignal = signal<AppLocale>(this.getInitialLocale());
  private readonly displayCurrencySignal = signal<Currency>(this.getInitialDisplayCurrency());

  readonly locale = this.localeSignal.asReadonly();
  readonly displayCurrency = this.displayCurrencySignal.asReadonly();

  readonly intlLocale = computed(() => {
    switch (this.localeSignal()) {
      case 'ru':
        return 'ru-RU';
      case 'es':
        return 'es-ES';
      default:
        return 'en-US';
    }
  });

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

  setDisplayCurrency(currency: Currency) {
    this.displayCurrencySignal.set(currency);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISPLAY_CURRENCY_KEY, currency);
    }
  }

  formatMoney(amount: number, currency: Currency = 'USD'): string {
    return new Intl.NumberFormat(this.intlLocale(), {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  }

  formatInDisplayCurrency(amount: number, from: Currency): string {
    const target = this.displayCurrencySignal();
    const converted = this.exchangeRateService.convert(amount, from, target);
    return this.formatMoney(converted, target);
  }

  formatMoneyBreakdown(entries: Array<{ amount: number; currency: Currency }>): string {
    const target = this.displayCurrencySignal();
    const total = entries.reduce((acc, entry) => {
      if (!entry.amount) return acc;
      return acc + this.exchangeRateService.convert(entry.amount, entry.currency, target);
    }, 0);

    return this.formatMoney(total, target);
  }

  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat(this.intlLocale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(typeof date === 'string' ? new Date(date) : date);
  }

  getDaysLabel(days: number): string {
    switch (this.localeSignal()) {
      case 'ru':
        return this.getRussianDaysLabel(days);
      case 'es':
        return Math.abs(days) === 1 ? 'dia' : 'dias';
      default:
        return Math.abs(days) === 1 ? 'day' : 'days';
    }
  }

  private getInitialLocale(): AppLocale {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en' || saved === 'es') {
        return saved;
      }
    }

    if (typeof navigator !== 'undefined') {
      const language = navigator.language.toLowerCase();

      if (language.startsWith('ru')) {
        return 'ru';
      }

      if (language.startsWith('es')) {
        return 'es';
      }

      if (language.startsWith('en')) {
        return 'en';
      }
    }

    return 'ru';
  }

  private getInitialDisplayCurrency(): Currency {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(DISPLAY_CURRENCY_KEY);
      if (saved === 'USD' || saved === 'EUR' || saved === 'RUB') {
        return saved;
      }
    }
    return 'USD';
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
