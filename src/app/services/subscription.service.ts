import { Injectable, signal, computed } from '@angular/core';
import { Subscription } from '../models/types';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private subsSignal = signal<Subscription[]>([
    { id: '1', name: 'Netflix', price: 1290, currency: 'RUB', cycle: 'month', category: 'streaming', nextBillingDate: '2026-04-10', lastUsedDate: '2026-03-15', isTrial: false },
    { id: '2', name: 'Spotify', price: 699, currency: 'RUB', cycle: 'month', category: 'music', nextBillingDate: '2026-03-25', lastUsedDate: '2026-03-17', isTrial: false },
    { id: '3', name: 'Adobe CC', price: 4490, currency: 'RUB', cycle: 'month', category: 'software', nextBillingDate: '2026-04-01', lastUsedDate: '2026-01-15', isTrial: false },
    { id: '4', name: 'Todoist', price: 3490, currency: 'RUB', cycle: 'year', category: 'software', nextBillingDate: '2026-11-15', lastUsedDate: '2026-03-18', isTrial: false },
    { id: '5', name: 'YouTube Premium', price: 399, currency: 'RUB', cycle: 'month', category: 'streaming', nextBillingDate: '2026-03-20', lastUsedDate: '2026-03-18', isTrial: true, trialEndDate: '2026-03-20' },
    { id: '6', name: 'ChatGPT Plus', price: 1990, currency: 'RUB', cycle: 'month', category: 'software', nextBillingDate: '2026-03-19', lastUsedDate: '2026-03-18', isTrial: false },
    { id: '7', name: 'Claude Pro', price: 1990, currency: 'RUB', cycle: 'month', category: 'software', nextBillingDate: '2026-04-05', lastUsedDate: '2026-03-10', isTrial: false },
  ]);

  subscriptions = this.subsSignal.asReadonly();

  totalMonthly = computed(() => {
    return this.subsSignal().reduce((acc, sub) => {
      if (sub.isTrial) return acc;
      return acc + (sub.cycle === 'month' ? sub.price : sub.price / 12);
    }, 0);
  });

  totalYearly = computed(() => {
    return this.totalMonthly() * 12;
  });

  categoryTotals = computed(() => {
    const totals: Record<string, number> = {};
    this.subsSignal().forEach(sub => {
      if (sub.isTrial) return;
      const monthly = sub.cycle === 'month' ? sub.price : sub.price / 12;
      totals[sub.category] = (totals[sub.category] || 0) + monthly;
    });
    return totals;
  });

  topCategory = computed(() => {
    const totals = this.categoryTotals();
    let max = 0;
    let top = 'other';
    for (const [cat, val] of Object.entries(totals)) {
      if (val > max) { max = val; top = cat; }
    }
    return top;
  });

  addSubscription(sub: Subscription) {
    this.subsSignal.update(subs => [...subs, sub]);
  }

  removeSubscription(id: string) {
    this.subsSignal.update(subs => subs.filter(s => s.id !== id));
  }
}
