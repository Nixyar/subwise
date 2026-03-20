import { Category, Currency } from './subscription.model';

export type TSubscriptionSuggestion = {
  name: string;
  keywords: string[];
  price: number;
  currency: Currency;
  category: Category;
  website?: string;
  iconSlug?: string;
  brandColor?: string;
  markets?: string[];
};
