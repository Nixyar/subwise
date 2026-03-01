import { AppLocale } from './locale.model';

export type LanguageOption = {
  code: AppLocale;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  enabled: boolean;
};

export const languages: LanguageOption[] = [
  {
    code: 'ru',
    label: 'Russian',
    nativeLabel: 'Русский',
    shortLabel: 'RU',
    enabled: true,
  },
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    shortLabel: 'EN',
    enabled: true,
  },
];
