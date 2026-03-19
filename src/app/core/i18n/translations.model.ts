import { Category, Cycle, Currency } from '../../features/subscriptions/subscription.model';

export type AppShellIntl = {
  dashboard: string;
  insights: string;
  summary: string;
  summaryShort: string;
  add: string;
};

export type DashboardIntl = {
  title: string;
  subtitle: string;
  monthly: string;
  yearly: string;
  categories: string;
  topCategory: string;
  score: string;
  scoreText: string;
  subscriptions: string;
  trial: string;
  billedToday: string;
  billedTomorrow: string;
  billedIn: string;
  billingDate: string;
  noSubscriptions: string;
  addSubscriptionAction: string;
  deleteAction: string;
  deleteConfirmTitle: string;
  deleteConfirmDescription: string;
  deleteConfirmSubmit: string;
  searchPlaceholder: string;
  categoryAll: string;
  categorySelected: string;
  sortLabel: string;
  sortTerm: string;
  sortPriceDesc: string;
  sortPriceAsc: string;
  sortName: string;
};

export type InsightsIntl = {
  title: string;
  subtitle: string;
  potentialSavings: string;
  upToYearly: string;
  potentialSavingsValue: string;
  emptyTitle: string;
  emptyText: string;
};

export type InsightIntl = {
  forgottenTitle: string;
  forgottenDescription: string;
  trialTitle: string;
  trialDescription: string;
  familyTitle: string;
  familyDescription: string;
  alternativeTitle: string;
  todoistAlternative: string;
  dropboxAlternative: string;
  annualTitle: string;
  annualDescription: string;
  aiDuplicatesTitle: string;
  aiDuplicatesDescription: string;
};

export type AddSubscriptionIntl = {
  title: string;
  subtitle: string;
  name: string;
  namePlaceholder: string;
  price: string;
  pricePlaceholder: string;
  currency: string;
  cycle: string;
  category: string;
  nextBillingDate: string;
  isTrial: string;
  trialEndDate: string;
  lastUsedDate: string;
  lastUsedDateHint: string;
  cancel: string;
  submit: string;
  monthly: string;
  yearly: string;
};

export type SubscriptionIntl = {
  categories: Record<Category, string>;
  cycles: Record<Cycle, string>;
  currencies: Record<Currency, string>;
  none: string;
};

export type SummaryIntl = {
  title: string;
  subtitle: string;
  spendingLabel: string;
  monthlySuffix: string;
  yearlySuffix: string;
  totalSubscriptions: string;
  topCategory: string;
  mostExpensive: string;
  potentialSavings: string;
  footnote: string;
  copied: string;
  copyImage: string;
  copyError: string;
};

export type AppTranslations = {
  layout: AppShellIntl;
  dashboard: DashboardIntl;
  insights: InsightsIntl;
  insight: InsightIntl;
  addSubscription: AddSubscriptionIntl;
  subscriptions: SubscriptionIntl;
  summary: SummaryIntl;
};
