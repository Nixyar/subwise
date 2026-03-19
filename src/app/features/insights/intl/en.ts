import { InsightIntl, InsightsIntl } from '../../../core/i18n/translations.model';

export const insightsIntlEn: InsightsIntl = {
  title: 'Advice',
  subtitle: 'Smart tips for optimizing your subscription costs',
  potentialSavings: 'Potential savings',
  upToYearly: 'Up to {amount} per year',
  potentialSavingsValue: 'Potential savings: {amount}',
  emptyTitle: 'Everything looks great!',
  emptyText: 'We did not find ways to optimize your current subscriptions.',
};

export const insightIntlEn: InsightIntl = {
  forgottenTitle: 'Forgotten subscription: {name}',
  forgottenDescription: 'You have not opened {name} for {days} {daysLabel}, but you still pay {price}/{cycle}. That is {yearly} per year.',
  trialTitle: 'Trial ending soon: {name}',
  trialDescription: 'The trial ends in {days} {daysLabel} ({date}). Cancel now if you do not plan to keep using it.',
  familyTitle: 'Cheaper together: {name}',
  familyDescription: 'Spotify Family is often more cost-effective than an individual plan when shared with family or friends. Check if a shared plan would be cheaper for you.',
  alternativeTitle: 'Free alternative for {name}',
  todoistAlternative: 'Instead of paying for Todoist, you could try built-in phone reminders or Microsoft To Do at no extra cost.',
  dropboxAlternative: 'If you do not need a large storage quota, a free plan from another cloud provider may be enough instead of Dropbox.',
  annualTitle: 'Annual trap: {name}',
  annualDescription: '{name} costs {monthly}/mo., which becomes {yearly} per year. If you do not use it every month, it is often better to subscribe only when needed.',
  aiDuplicatesTitle: 'Duplicate AI services',
  aiDuplicatesDescription: 'You have {count} AI subscriptions ({names}). In most cases, one strong model is enough. Keep one and save money.',
};
