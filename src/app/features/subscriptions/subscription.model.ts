export type Currency = 'RUB' | 'USD' | 'EUR';
export type Cycle = 'month' | 'year';
export type Category = 'streaming' | 'music' | 'cloud' | 'sport' | 'software' | 'other';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  cycle: Cycle;
  category: Category;
  nextBillingDate: string;
  lastUsedDate?: string;
  isTrial: boolean;
  trialEndDate?: string;
}
