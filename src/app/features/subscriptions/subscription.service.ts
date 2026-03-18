import { Injectable, computed, effect, signal } from '@angular/core';
import { Subscription } from './subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly storageKey = 'subwise.subscriptions';
  private subsSignal = signal<Subscription[]>(this.loadSubscriptions());

  subscriptions = this.subsSignal.asReadonly();

  constructor() {
    effect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(this.storageKey, JSON.stringify(this.subsSignal()));
    });
  }

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

  private loadSubscriptions(): Subscription[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(this.storageKey);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
