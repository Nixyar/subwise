import {Category, Currency, Cycle, Subscription} from '../../features/subscriptions/subscription.model';

const locale = 'ru-RU';

export function formatMoney(amount: number, currency: Currency = 'RUB'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRu(date: string | Date): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(typeof date === 'string' ? new Date(date) : date);
}

export function getCycleLabel(cycle: Cycle): string {
  return cycle === 'month' ? 'мес.' : 'год';
}

export function getCategoryName(category: Category | string): string {
  const names: Record<string, string> = {
    streaming: 'Стриминг',
    music: 'Музыка',
    cloud: 'Облако',
    sport: 'Спорт',
    software: 'Софт',
    other: 'Другое',
  };

  return names[category] || 'Другое';
}

export function getCurrencyLabel(currency: Currency): string {
  const labels: Record<Currency, string> = {
    RUB: 'Российский рубль (₽)',
  };

  return labels[currency];
}

export function getDaysLabel(days: number): string {
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

export function annualCost(sub: Subscription): number {
  return sub.cycle === 'month' ? sub.price * 12 : sub.price;
}
