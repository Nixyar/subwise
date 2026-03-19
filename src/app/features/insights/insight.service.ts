import { Injectable, computed, inject } from '@angular/core';
import { annualCost } from '../../core/utils/formatters';
import { interpolate } from '../../core/i18n/interpolate';
import { LocaleService } from '../../core/i18n/locale.service';
import { Insight } from './insight.model';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { translations } from '../../core/i18n/translations';

@Injectable({ providedIn: 'root' })
export class InsightService {
  private subService = inject(SubscriptionService);
  private localeService = inject(LocaleService);

  totalPotentialSavings = computed(() => {
    return this.insights().reduce((acc, insight) => acc + (insight.savings || 0), 0);
  });

  hasPotentialSavings = computed(() => {
    return this.insights().some((insight) => Boolean(insight.savings && insight.savingsCurrency));
  });

  insights = computed(() => {
    const locale = this.localeService.locale();
    const copy = translations[locale].insight;
    const subscriptionCopy = translations[locale].subscriptions;
    const subs = this.subService.subscriptions();
    const insights: Insight[] = [];
    const today = new Date();

    subs.forEach(sub => {
      if (sub.lastUsedDate) {
        const lastUsed = new Date(sub.lastUsedDate);
        const diffDays = Math.floor((today.getTime() - lastUsed.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 30 && !sub.isTrial) {
          const yearlyCost = annualCost(sub);
          insights.push({
            id: `forgotten-${sub.id}`,
            type: 'warning',
            title: interpolate(copy.forgottenTitle, {name: sub.name}),
            description: interpolate(copy.forgottenDescription, {
              name: sub.name,
              days: diffDays,
              daysLabel: this.localeService.getDaysLabel(diffDays),
              price: this.localeService.formatMoney(sub.price, sub.currency),
              cycle: subscriptionCopy.cycles[sub.cycle],
              yearly: this.localeService.formatMoney(yearlyCost, sub.currency),
            }),
            savings: yearlyCost,
            savingsCurrency: sub.currency,
          });
        }
      }

      if (sub.isTrial && sub.trialEndDate) {
        const trialEnd = new Date(sub.trialEndDate);
        const diffDays = Math.floor((trialEnd.getTime() - today.getTime()) / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays <= 3) {
          insights.push({
            id: `trial-${sub.id}`,
            type: 'trial',
            title: interpolate(copy.trialTitle, {name: sub.name}),
            description: interpolate(copy.trialDescription, {
              days: diffDays,
              daysLabel: this.localeService.getDaysLabel(diffDays),
              date: this.localeService.formatDate(trialEnd),
            }),
            savings: annualCost(sub),
            savingsCurrency: sub.currency,
          });
        }
      }

      if (sub.name.toLowerCase().includes('spotify') && sub.price > 300 && sub.price < 1000) {
         insights.push({
            id: `family-${sub.id}`,
            type: 'suggestion',
            title: interpolate(copy.familyTitle, {name: sub.name}),
            description: copy.familyDescription,
         });
      }

      if (sub.name.toLowerCase().includes('todoist') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: interpolate(copy.alternativeTitle, {name: sub.name}),
            description: copy.todoistAlternative,
            savings: annualCost(sub),
            savingsCurrency: sub.currency,
         });
      }
      if (sub.name.toLowerCase().includes('dropbox') && sub.price > 0) {
         insights.push({
            id: `alt-${sub.id}`,
            type: 'info',
            title: interpolate(copy.alternativeTitle, {name: sub.name}),
            description: copy.dropboxAlternative,
         });
      }

      if (sub.name.toLowerCase().includes('netflix') && sub.cycle === 'month') {
          insights.push({
            id: `annual-${sub.id}`,
            type: 'suggestion',
            title: interpolate(copy.annualTitle, {name: sub.name}),
            description: interpolate(copy.annualDescription, {
              name: sub.name,
              monthly: this.localeService.formatMoney(sub.price, sub.currency),
              yearly: this.localeService.formatMoney(sub.price * 12, sub.currency),
            }),
          });
      }
    });

    const aiKeywords = ['chatgpt', 'claude', 'midjourney', 'copilot', 'openai'];
    const aiSubs = subs.filter((s) => aiKeywords.some((kw) => s.name.toLowerCase().includes(kw)));
    const aiSubsByCurrency = new Map<string, typeof aiSubs>();

    aiSubs.forEach((sub) => {
      aiSubsByCurrency.set(sub.currency, [...(aiSubsByCurrency.get(sub.currency) || []), sub]);
    });

    aiSubsByCurrency.forEach((group, currency) => {
      if (group.length <= 1) {
        return;
      }

      const totalAiCost = group.reduce((acc, s) => acc + annualCost(s), 0);
      const cheapest = [...group].sort((a, b) => annualCost(a) - annualCost(b))[0];
      const savings = totalAiCost - annualCost(cheapest);

      insights.push({
        id: `ai-duplicates-${currency}`,
        type: 'suggestion',
        title: copy.aiDuplicatesTitle,
        description: interpolate(copy.aiDuplicatesDescription, {
          count: group.length,
          names: group.map((s) => s.name).join(', '),
        }),
        savings,
        savingsCurrency: currency as typeof group[number]['currency'],
      });
    });

    return insights;
  });
}
