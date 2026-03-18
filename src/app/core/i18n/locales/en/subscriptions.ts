import { AddSubscriptionIntl, SubscriptionIntl } from '../../translations.model';

export const addSubscriptionEn: AddSubscriptionIntl = {
  title: 'Add subscription',
  subtitle: 'Fill in the details so the app can track charges and spending',
  name: 'Service name',
  namePlaceholder: 'For example, a video service or cloud storage',
  price: 'Price',
  pricePlaceholder: '599',
  currency: 'Currency',
  cycle: 'Billing cycle',
  category: 'Category',
  nextBillingDate: 'Next billing date',
  isTrial: 'This is a trial period',
  trialEndDate: 'Trial end date',
  lastUsedDate: 'Last used (optional)',
  lastUsedDateHint: 'Helps us find forgotten subscriptions',
  cancel: 'Cancel',
  submit: 'Add subscription',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export const subscriptionsEn: SubscriptionIntl = {
  categories: {
    streaming: 'Streaming',
    music: 'Music',
    cloud: 'Cloud',
    sport: 'Sport',
    software: 'Software',
    other: 'Other',
  },
  cycles: {
    month: 'mo.',
    year: 'year',
  },
  currencies: {
    RUB: 'Russian ruble (₽)',
    USD: 'US dollar ($)',
    EUR: 'Euro (€)',
  },
  none: 'no data',
};
