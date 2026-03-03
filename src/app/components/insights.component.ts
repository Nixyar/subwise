import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightService } from '../services/insight.service';
import { MatIconModule } from '@angular/material/icon';
import { formatMoney } from '../utils/formatters';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Советы</h1>
        <p class="text-gray-500 mt-1">Умные советы по оптимизации твоих расходов</p>
      </header>

      @if (insightService.totalPotentialSavings() > 0) {
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <h2 class="text-emerald-50 text-sm font-medium uppercase tracking-wider mb-1">Потенциальная экономия</h2>
            <div class="text-3xl md:text-4xl font-bold">До {{ formatMoney(insightService.totalPotentialSavings()) }} в год</div>
          </div>
          <div class="w-16 h-16 bg-white/20 rounded-full hidden md:flex items-center justify-center backdrop-blur-sm">
            <mat-icon class="text-4xl w-10 h-10 text-white">savings</mat-icon>
          </div>
        </div>
      }

      <div class="grid gap-4">
        @for (insight of insightService.insights(); track insight.id) {
          <div class="rounded-2xl p-5 shadow-sm border flex items-start space-x-4"
               [ngClass]="{
                 'bg-red-50 border-red-100': insight.type === 'warning',
                 'bg-emerald-50 border-emerald-100': insight.type === 'suggestion',
                 'bg-blue-50 border-blue-100': insight.type === 'info',
                 'bg-amber-50 border-amber-100': insight.type === 'trial'
               }">
            
            <div class="mt-1"
                 [ngClass]="{
                   'text-red-500': insight.type === 'warning',
                   'text-emerald-500': insight.type === 'suggestion',
                   'text-blue-500': insight.type === 'info',
                   'text-amber-500': insight.type === 'trial'
                 }">
              <mat-icon>{{ getIcon(insight.type) }}</mat-icon>
            </div>
            
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ insight.title }}</h3>
              <p class="text-gray-700 mt-1 text-sm leading-relaxed">{{ insight.description }}</p>
              
              @if (insight.savings) {
                <div class="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-800 border border-black/5">
                  <mat-icon class="text-[14px] w-[14px] h-[14px] mr-1 text-emerald-600">savings</mat-icon>
                  Потенциальная экономия: {{ formatMoney(insight.savings) }}
                </div>
              }
            </div>
          </div>
        } @empty {
          <div class="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100">
            <mat-icon class="text-gray-400 text-4xl mb-2">check_circle</mat-icon>
            <h3 class="text-lg font-medium text-gray-900">Всё идеально!</h3>
            <p class="text-gray-500 mt-1">Мы не нашли способов оптимизировать твои текущие подписки.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class InsightsComponent {
  insightService = inject(InsightService);
  formatMoney = formatMoney;

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
