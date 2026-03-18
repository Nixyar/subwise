import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightService } from '../insights/insight.service';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import html2canvas from 'html2canvas';
import { LocaleService } from '../../core/i18n/locale.service';
import { translations } from '../../core/i18n/translations';
import { Category, Currency } from '../subscriptions/subscription.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  subService = inject(SubscriptionService);
  insightService = inject(InsightService);
  localeService = inject(LocaleService);
  isCopied = signal(false);
  copy = computed(() => translations[this.localeService.locale()].summary);

  mostExpensive = () => {
    const subs = this.subService.subscriptions();
    if (subs.length === 0) return null;
    return subs.reduce((prev, current) => (prev.price > current.price) ? prev : current);
  };

  getCategoryName(category: string): string {
    return translations[this.localeService.locale()].subscriptions.categories[category as Category];
  }

  getNoneLabel(): string {
    return translations[this.localeService.locale()].subscriptions.none;
  }

  getTopCategoryLabel(): string {
    if (this.subService.subscriptions().length === 0) {
      return this.getNoneLabel();
    }

    return this.getCategoryName(this.getTopCategory());
  }

  mostExpensiveLabel() {
    const sub = this.mostExpensive();
    if (!sub) {
      return this.getNoneLabel();
    }

    return `${this.formatMoney(sub.price, sub.currency)}/${translations[this.localeService.locale()].subscriptions.cycles[sub.cycle]}`;
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

  potentialSavingsText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.insightService.insights()
        .filter((insight) => Boolean(insight.savings && insight.savingsCurrency))
        .map((insight) => ({
          amount: insight.savings || 0,
          currency: insight.savingsCurrency!,
        }))
    );
  }

  private getTopCategory(): string {
    const subs = this.subService.subscriptions().filter((sub) => !sub.isTrial);
    const currencies = new Set(subs.map((sub) => sub.currency));
    const totals = subs.reduce<Record<string, number>>((acc, sub) => {
      const weight = currencies.size <= 1 ? (sub.cycle === 'month' ? sub.price : sub.price / 12) : 1;
      acc[sub.category] = (acc[sub.category] || 0) + weight;
      return acc;
    }, {});

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

  async copyImage() {
    const element = document.getElementById('summary-card');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        backgroundColor: null,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            this.isCopied.set(true);
            setTimeout(() => this.isCopied.set(false), 3000);
          } catch (err) {
            console.error('Failed to copy image: ', err);
            alert(this.copy().copyError);
          }
        }
      });
    } catch (err) {
      console.error('Error generating image: ', err);
    }
  }
}
