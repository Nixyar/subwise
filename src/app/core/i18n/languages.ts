import { AppLocale } from './locale.model';

export type LanguageOption = {
  code: AppLocale;
  label: string;
  nativeLabel: string;
  enabled: boolean;
};

export const languages: LanguageOption[] = [
  {
    code: 'ru',
    label: 'Russian',
    nativeLabel: 'Русский',
    enabled: true,
  },
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    enabled: true,
  },
];
