import { AppLocale } from './locale.model';
import { AppTranslations } from './translations.model';
import { layoutRu } from './locales/ru/layout';
import { dashboardRu } from './locales/ru/dashboard';
import { insightRu, insightsRu } from './locales/ru/insights';
import { addSubscriptionRu, subscriptionsRu } from './locales/ru/subscriptions';
import { summaryRu } from './locales/ru/summary';
import { layoutEn } from './locales/en/layout';
import { dashboardEn } from './locales/en/dashboard';
import { insightEn, insightsEn } from './locales/en/insights';
import { addSubscriptionEn, subscriptionsEn } from './locales/en/subscriptions';
import { summaryEn } from './locales/en/summary';

export const translations: Record<AppLocale, AppTranslations> = {
  ru: {
    layout: layoutRu,
    dashboard: dashboardRu,
    insights: insightsRu,
    insight: insightRu,
    addSubscription: addSubscriptionRu,
    subscriptions: subscriptionsRu,
    summary: summaryRu,
  },
  en: {
    layout: layoutEn,
    dashboard: dashboardEn,
    insights: insightsEn,
    insight: insightEn,
    addSubscription: addSubscriptionEn,
    subscriptions: subscriptionsEn,
    summary: summaryEn,
  },
};
