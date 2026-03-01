import { Injectable, computed, inject } from '@angular/core';
import { SubscriptionService } from './subscription.service';

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
          const yearlyCost = sub.cycle === 'month' ? sub.price * 12 : sub.price;
          insights.push({
            id: `forgotten-${sub.id}`,
            type: 'warning',
            title: `Забытая подписка: ${sub.name}`,
            description: `Ты не открывал ${sub.name} уже ${diffDays} дней, а платишь $${sub.price}/${sub.cycle === 'month' ? 'мес' : 'год'}. Это $${yearlyCost.toFixed(2)}/год.`,
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
            title: `Скоро списание: ${sub.name} (Trial)`,
            description: `Пробный период заканчивается через ${diffDays} дней (${trialEnd.toLocaleDateString()}). Отмени сейчас, если не планируешь использовать.`,
            savings: sub.cycle === 'month' ? sub.price * 12 : sub.price
          });
        }
      }

      // 3. Cheaper together
      if (sub.name.toLowerCase().includes('spotify') && sub.price > 5 && sub.price < 12) {
         insights.push({
            id: `family-${sub.id}`,
            type: 'suggestion',
            title: `Дешевле вместе: ${sub.name}`,
            description: `Spotify Individual $10.99/мес → Family $16.99/мес на 6 человек = $2.83 каждый. Экономия огромная, если найти друзей.`,
         });
      }

      // 4. Free alternatives
      if (sub.name.toLowerCase().includes('todoist') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: `Бесплатная альтернатива для ${sub.name}`,
            description: `Вместо Todoist Premium можно использовать встроенные Напоминания в телефоне или Microsoft To Do бесплатно.`,
            savings: sub.cycle === 'month' ? sub.price * 12 : sub.price
         });
      }
      if (sub.name.toLowerCase().includes('dropbox') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: `Бесплатная альтернатива для ${sub.name}`,
            description: `Вместо Dropbox Plus можно использовать 15GB Google Drive бесплатно, если тебе не нужно много места.`,
         });
      }
      
      // 5. Annual trap
      if (sub.name.toLowerCase().includes('netflix') && sub.cycle === 'month') {
          insights.push({
            id: `annual-${sub.id}`,
            type: 'suggestion',
            title: `Годовая ловушка: ${sub.name}`,
            description: `Netflix $${sub.price}/мес = $${(sub.price * 12).toFixed(2)}/год. Если не уверен, что будешь смотреть весь год — отменяй в месяцы простоя.`,
          });
      }
    });

    // 6. AI Duplicates
    const aiKeywords = ['chatgpt', 'claude', 'gemini', 'midjourney', 'copilot', 'openai'];
    const aiSubs = subs.filter(s => aiKeywords.some(kw => s.name.toLowerCase().includes(kw)));
    if (aiSubs.length > 1) {
      const totalAiCost = aiSubs.reduce((acc, s) => acc + (s.cycle === 'month' ? s.price * 12 : s.price), 0);
      const cheapest = [...aiSubs].sort((a, b) => a.price - b.price)[0];
      const savings = totalAiCost - (cheapest.cycle === 'month' ? cheapest.price * 12 : cheapest.price);
      
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
