import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import { LocaleService } from '../../core/i18n/locale.service';
import { interpolate } from '../../core/i18n/interpolate';
import { translations } from '../../core/i18n/translations';
import { Category, Currency, Cycle } from '../subscriptions/subscription.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  subService = inject(SubscriptionService);
  localeService = inject(LocaleService);
  copy = computed(() => translations[this.localeService.locale()].dashboard);

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'streaming': 'live_tv',
      'music': 'music_note',
      'cloud': 'cloud',
      'sport': 'fitness_center',
      'software': 'computer',
      'other': 'category'
    };
    return icons[category] || 'category';
  }

  formatMoney(amount: number, currency: Currency = 'RUB'): string {
    return this.localeService.formatMoney(amount, currency);
  }

  monthlyTotalText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.subService.subscriptions()
        .filter((sub) => !sub.isTrial)
        .map((sub) => ({
          amount: sub.cycle === 'month' ? sub.price : sub.price / 12,
          currency: sub.currency,
        }))
    );
  }

  yearlyTotalText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.subService.subscriptions()
        .filter((sub) => !sub.isTrial)
        .map((sub) => ({
          amount: sub.cycle === 'month' ? sub.price * 12 : sub.price,
          currency: sub.currency,
        }))
    );
  }

  formatDate(date: string): string {
    return this.localeService.formatDate(date);
  }

  getCategoryName(category: string): string {
    return translations[this.localeService.locale()].subscriptions.categories[category as Category];
  }

  getTopCategoryLabel(): string {
    if (this.subService.subscriptions().length === 0) {
      return translations[this.localeService.locale()].subscriptions.none;
    }

    return this.getCategoryName(this.getTopCategory());
  }

  getCycleLabel(cycle: Cycle): string {
    return translations[this.localeService.locale()].subscriptions.cycles[cycle];
  }

  getTrialLabel(): string {
    return this.copy().trial;
  }

  getScoreText(): string {
    return interpolate(this.copy().scoreText, {
      count: this.subService.subscriptions().length,
    });
  }

  getBillingStatus(days: number, nextBillingDate: string): string {
    if (days === 0) {
      return this.copy().billedToday;
    }

    if (days === 1) {
      return this.copy().billedTomorrow;
    }

    if (days > 1 && days <= 3) {
      return interpolate(this.copy().billedIn, {
        days,
        label: this.localeService.getDaysLabel(days),
      });
    }

    return interpolate(this.copy().billingDate, {
      date: this.formatDate(nextBillingDate),
    });
  }

  daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  getConicGradient(): string {
    const totals = this.getCategoryTotals();
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    if (total === 0) return 'conic-gradient(#f3f4f6 0% 100%)';

    const colors: Record<string, string> = {
      'streaming': '#ef4444', // red-500
      'music': '#10b981', // emerald-500
      'cloud': '#3b82f6', // blue-500
      'sport': '#f59e0b', // amber-500
      'software': '#8b5cf6', // violet-500
      'other': '#6b7280' // gray-500
    };

    let gradient = 'conic-gradient(';
    let currentAngle = 0;
    for (const [cat, val] of Object.entries(totals)) {
      const percentage = (val / total) * 100;
      gradient += `${colors[cat] || colors['other']} ${currentAngle}% ${currentAngle + percentage}%, `;
      currentAngle += percentage;
    }
    gradient = gradient.slice(0, -2) + ')';
    return gradient;
  }

  private getCategoryTotals(): Record<string, number> {
    const subs = this.subService.subscriptions().filter((sub) => !sub.isTrial);
    const currencies = new Set(subs.map((sub) => sub.currency));

    if (currencies.size <= 1) {
      return this.subService.categoryTotals();
    }

    return subs.reduce<Record<string, number>>((totals, sub) => {
      totals[sub.category] = (totals[sub.category] || 0) + 1;
      return totals;
    }, {});
  }

  private getTopCategory(): string {
    const totals = this.getCategoryTotals();
    let max = 0;
    let top = 'other';

    for (const [category, value] of Object.entries(totals)) {
      if (value > max) {
        max = value;
        top = category;
      }
    }

    return top;
  }
}
