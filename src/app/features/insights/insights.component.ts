import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightService } from './insight.service';
import { MatIconModule } from '@angular/material/icon';
import { LocaleService } from '../../core/i18n/locale.service';
import { interpolate } from '../../core/i18n/interpolate';
import { translations } from '../../core/i18n/translations';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
  insightService = inject(InsightService);
  localeService = inject(LocaleService);
  copy = computed(() => translations[this.localeService.locale()].insights);

  totalPotentialSavingsText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.insightService.insights()
        .filter((insight) => Boolean(insight.savings && insight.savingsCurrency))
        .map((insight) => ({
          amount: insight.savings || 0,
          currency: insight.savingsCurrency!,
        }))
    );
  }

  potentialSavingsText(amount: number, currency?: 'RUB' | 'USD' | 'EUR'): string {
    return interpolate(this.copy().potentialSavingsValue, {
      amount: currency ? this.localeService.formatInDisplayCurrency(amount, currency) : String(amount),
    });
  }

  upToYearlyText(): string {
    return interpolate(this.copy().upToYearly, {
      amount: this.totalPotentialSavingsText(),
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'suggestion': return 'lightbulb';
      case 'info': return 'info';
      case 'trial': return 'timer';
      default: return 'lightbulb';
    }
  }
}
