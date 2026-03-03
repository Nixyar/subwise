import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../services/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import { formatDateRu, formatMoney, getCategoryName, getCycleLabel, getDaysLabel } from '../utils/formatters';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Дашборд</h1>
        <p class="text-gray-500 mt-1">Твои подписки под контролем</p>
      </header>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">В месяц</span>
          <span class="text-4xl font-light text-gray-900 mt-2">{{ formatMoney(subService.totalMonthly()) }}</span>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">В год</span>
          <span class="text-4xl font-light text-gray-900 mt-2">{{ formatMoney(subService.totalYearly()) }}</span>
        </div>
        
        <!-- Doughnut Chart Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
          <div class="relative w-16 h-16 rounded-full shrink-0 shadow-inner" [style.background]="getConicGradient()">
            <div class="absolute inset-2 bg-white rounded-full"></div>
          </div>
          <div class="flex-1">
            <span class="text-sm font-medium text-gray-500 uppercase tracking-wider">Категории</span>
            <div class="mt-1 text-sm font-medium text-gray-900 capitalize">{{ getCategoryName(subService.topCategory()) }}</div>
            <div class="text-xs text-gray-500">Топ категория</div>
          </div>
        </div>

        <div class="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100 flex flex-col justify-center items-start">
          <div class="flex items-center text-indigo-700 mb-2">
            <mat-icon class="mr-2">insights</mat-icon>
            <span class="font-medium">Оценка SubWise</span>
          </div>
          <p class="text-sm text-indigo-900">У тебя {{ subService.subscriptions().length }} активных подписок. Загляни в советы.</p>
        </div>
      </div>

      <!-- Subscriptions List -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Мои подписки</h2>
        </div>
        
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="divide-y divide-gray-100">
            @for (sub of subService.subscriptions(); track sub.id) {
              <div class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <mat-icon>{{ getCategoryIcon(sub.category) }}</mat-icon>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900 flex items-center">
                      {{ sub.name }}
                      @if (sub.isTrial) {
                        <span class="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full">Пробный период</span>
                      }
                    </h3>
                    @let days = daysUntil(sub.nextBillingDate);
                    <p class="text-xs mt-0.5 flex items-center" [ngClass]="{'text-orange-600 font-medium': days >= 0 && days <= 3, 'text-gray-500': days > 3 || days < 0}">
                      @if (days === 0) {
                        <mat-icon class="text-[14px] w-[14px] h-[14px] mr-1">warning</mat-icon> Спишут сегодня!
                      } @else if (days === 1) {
                        <mat-icon class="text-[14px] w-[14px] h-[14px] mr-1">warning</mat-icon> Завтра спишут!
                      } @else if (days > 1 && days <= 3) {
                        <mat-icon class="text-[14px] w-[14px] h-[14px] mr-1">warning</mat-icon> Спишут через {{ days }} {{ getDaysLabel(days) }}
                      } @else {
                        Списание: {{ formatDateRu(sub.nextBillingDate) }}
                      }
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900">{{ formatMoney(sub.price, sub.currency) }}</div>
                  <div class="text-xs text-gray-500">/ {{ getCycleLabel(sub.cycle) }}</div>
                </div>
              </div>
            } @empty {
              <div class="p-8 text-center text-gray-500">
                У тебя пока нет добавленных подписок.
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
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
