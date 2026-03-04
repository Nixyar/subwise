import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightService } from '../insights/insight.service';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import html2canvas from 'html2canvas';
import { formatMoney, getCategoryName, getCycleLabel } from '../../core/utils/formatters';

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
  isCopied = signal(false);
  formatMoney = formatMoney;

  mostExpensive = () => {
    const subs = this.subService.subscriptions();
    if (subs.length === 0) return null;
    return subs.reduce((prev, current) => (prev.price > current.price) ? prev : current);
  };

  getCategoryName(category: string): string {
    return getCategoryName(category);
  }

  potentialSavings = () => {
    return this.insightService.insights().reduce((acc, insight) => acc + (insight.savings || 0), 0);
  };

  mostExpensiveLabel() {
    const sub = this.mostExpensive();
    if (!sub) {
      return 'нет данных';
    }

    return `${formatMoney(sub.price, sub.currency)}/${getCycleLabel(sub.cycle)}`;
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
            alert('Не удалось скопировать картинку. Возможно, ваш браузер не поддерживает эту функцию.');
          }
        }
      });
    } catch (err) {
      console.error('Error generating image: ', err);
    }
  }
}
