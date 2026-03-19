import { AppLocale } from './locale.model';
import { AppTranslations } from './translations.model';
import { appShellIntlRu } from '../layout/intl/ru';
import { appShellIntlEn } from '../layout/intl/en';
import { appShellIntlEs } from '../layout/intl/es';
import { dashboardIntlRu } from '../../features/dashboard/intl/ru';
import { dashboardIntlEn } from '../../features/dashboard/intl/en';
import { dashboardIntlEs } from '../../features/dashboard/intl/es';
import { insightIntlRu, insightsIntlRu } from '../../features/insights/intl/ru';
import { insightIntlEn, insightsIntlEn } from '../../features/insights/intl/en';
import { insightIntlEs, insightsIntlEs } from '../../features/insights/intl/es';
import { addSubscriptionIntlRu, subscriptionsIntlRu } from '../../features/subscriptions/intl/ru';
import { addSubscriptionIntlEn, subscriptionsIntlEn } from '../../features/subscriptions/intl/en';
import { addSubscriptionIntlEs, subscriptionsIntlEs } from '../../features/subscriptions/intl/es';
import { summaryIntlRu } from '../../features/summary/intl/ru';
import { summaryIntlEn } from '../../features/summary/intl/en';
import { summaryIntlEs } from '../../features/summary/intl/es';

export const translations: Record<AppLocale, AppTranslations> = {
  ru: {
    layout: appShellIntlRu,
    dashboard: dashboardIntlRu,
    insights: insightsIntlRu,
    insight: insightIntlRu,
    addSubscription: addSubscriptionIntlRu,
    subscriptions: subscriptionsIntlRu,
    summary: summaryIntlRu,
  },
  en: {
    layout: appShellIntlEn,
    dashboard: dashboardIntlEn,
    insights: insightsIntlEn,
    insight: insightIntlEn,
    addSubscription: addSubscriptionIntlEn,
    subscriptions: subscriptionsIntlEn,
    summary: summaryIntlEn,
  },
  es: {
    layout: appShellIntlEs,
    dashboard: dashboardIntlEs,
    insights: insightsIntlEs,
    insight: insightIntlEs,
    addSubscription: addSubscriptionIntlEs,
    subscriptions: subscriptionsIntlEs,
    summary: summaryIntlEs,
  },
};
