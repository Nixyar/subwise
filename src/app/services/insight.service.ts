import { Injectable, computed, inject } from '@angular/core';
import { SubscriptionService } from './subscription.service';
import { annualCost, formatDateRu, formatMoney, getDaysLabel, getCycleLabel } from '../utils/formatters';

export interface Insight {
  id: string;
  type: 'warning' | 'suggestion' | 'info' | 'trial';
  title: string;
  description: string;
  savings?: number;
}

@Injectable({ providedIn: 'root' })
export class InsightService {
  private subService = inject(SubscriptionService);

  totalPotentialSavings = computed(() => {
    return this.insights().reduce((acc, insight) => acc + (insight.savings || 0), 0);
  });

  insights = computed(() => {
    const subs = this.subService.subscriptions();
    const insights: Insight[] = [];
    const today = new Date();

    subs.forEach(sub => {
      // 1. Forgotten subscriptions (> 30 days)
      if (sub.lastUsedDate) {
        const lastUsed = new Date(sub.lastUsedDate);
        const diffDays = Math.floor((today.getTime() - lastUsed.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 30 && !sub.isTrial) {
          const yearlyCost = annualCost(sub);
          insights.push({
            id: `forgotten-${sub.id}`,
            type: 'warning',
            title: `Забытая подписка: ${sub.name}`,
            description: `Ты не открывал ${sub.name} уже ${diffDays} ${getDaysLabel(diffDays)}, а платишь ${formatMoney(sub.price, sub.currency)}/${getCycleLabel(sub.cycle)}. Это ${formatMoney(yearlyCost, sub.currency)} в год.`,
            savings: yearlyCost
          });
        }
      }

      // 2. Trial calendar
      if (sub.isTrial && sub.trialEndDate) {
        const trialEnd = new Date(sub.trialEndDate);
        const diffDays = Math.floor((trialEnd.getTime() - today.getTime()) / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
          insights.push({
            id: `trial-${sub.id}`,
            type: 'trial',
            title: `Скоро закончится пробный период: ${sub.name}`,
            description: `Пробный период закончится через ${diffDays} ${getDaysLabel(diffDays)} (${formatDateRu(trialEnd)}). Отмени сейчас, если не планируешь пользоваться сервисом.`,
            savings: annualCost(sub)
          });
        }
      }

      // 3. Cheaper together
      if (sub.name.toLowerCase().includes('spotify') && sub.price > 300 && sub.price < 1000) {
         insights.push({
            id: `family-${sub.id}`,
            type: 'suggestion',
            title: `Дешевле вместе: ${sub.name}`,
            description: `Семейный тариф Spotify обычно выгоднее личного, если делить оплату с близкими. Проверь, не дешевле ли перейти на общий план.`,
         });
      }

      // 4. Free alternatives
      if (sub.name.toLowerCase().includes('todoist') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: `Бесплатная альтернатива для ${sub.name}`,
            description: `Вместо платного Todoist можно попробовать встроенные Напоминания на телефоне или Microsoft To Do без дополнительной оплаты.`,
            savings: annualCost(sub)
         });
      }
      if (sub.name.toLowerCase().includes('dropbox') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: `Бесплатная альтернатива для ${sub.name}`,
            description: `Если тебе не нужен большой объём хранилища, вместо Dropbox можно рассмотреть бесплатные тарифы других облачных сервисов.`,
         });
      }
      
      // 5. Annual trap
      if (sub.name.toLowerCase().includes('netflix') && sub.cycle === 'month') {
          insights.push({
            id: `annual-${sub.id}`,
            type: 'suggestion',
            title: `Годовая ловушка: ${sub.name}`,
            description: `${sub.name} стоит ${formatMoney(sub.price, sub.currency)}/мес., это ${formatMoney(sub.price * 12, sub.currency)} в год. Если смотришь не каждый месяц, выгоднее подключать сервис только по мере необходимости.`,
          });
      }
    });

    // 6. AI Duplicates
    const aiKeywords = ['chatgpt', 'claude', 'midjourney', 'copilot', 'openai'];
    const aiSubs = subs.filter(s => aiKeywords.some(kw => s.name.toLowerCase().includes(kw)));
    if (aiSubs.length > 1) {
      const totalAiCost = aiSubs.reduce((acc, s) => acc + annualCost(s), 0);
      const cheapest = [...aiSubs].sort((a, b) => a.price - b.price)[0];
      const savings = totalAiCost - annualCost(cheapest);
      
      insights.push({
        id: 'ai-duplicates',
        type: 'suggestion',
        title: 'Дубли AI-сервисов',
        description: `У тебя ${aiSubs.length} подписки на нейросети (${aiSubs.map(s => s.name).join(', ')}). Обычно для работы хватает одной мощной модели. Оставь одну и сэкономь.`,
        savings: savings
      });
    }

    return insights;
  });
}
