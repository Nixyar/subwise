import { Injectable, signal } from '@angular/core';
import { Currency } from '../../features/subscriptions/subscription.model';

const CACHE_KEY = 'subwise.exchangeRates';
const CACHE_TIMESTAMP_KEY = 'subwise.exchangeRatesTimestamp';
const CACHE_TTL_MS = 60 * 60 * 1000;

const FALLBACK_RATES: Record<Currency, number> = { USD: 1, EUR: 0.92, RUB: 90 };

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly ratesSignal = signal<Record<Currency, number>>(FALLBACK_RATES);

  readonly rates = this.ratesSignal.asReadonly();

  constructor() {
    this.initRates();
  }

  convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;
    const rates = this.ratesSignal();
    const inUSD = amount / rates[from];
    return inUSD * rates[to];
  }

  private async initRates(): Promise<void> {
    const cached = this.loadFromCache();
    if (cached) {
      this.ratesSignal.set(cached);
      return;
    }
    await this.fetchRates();
  }

  private loadFromCache(): Record<Currency, number> | null {
    if (typeof localStorage === 'undefined') return null;
    const ts = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!ts || Date.now() - parseInt(ts, 10) > CACHE_TTL_MS) return null;
    const data = localStorage.getItem(CACHE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private async fetchRates(): Promise<void> {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      const rates: Record<Currency, number> = {
        USD: data.rates?.['USD'] ?? 1,
        EUR: data.rates?.['EUR'] ?? 0.92,
        RUB: data.rates?.['RUB'] ?? 90,
      };
      this.ratesSignal.set(rates);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      }
    } catch {
    }
  }
}
