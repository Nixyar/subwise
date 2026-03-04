import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import {
  formatDateRu,
  formatMoney,
  getCategoryName,
  getCycleLabel,
  getDaysLabel,
} from '../../core/utils/formatters';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  subService = inject(SubscriptionService);
  formatMoney = formatMoney;
  formatDateRu = formatDateRu;
  getDaysLabel = getDaysLabel;
  getCycleLabel = getCycleLabel;

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

  getCategoryName(category: string): string {
    return getCategoryName(category);
  }

  daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  getConicGradient(): string {
    const totals = this.subService.categoryTotals();
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
}
