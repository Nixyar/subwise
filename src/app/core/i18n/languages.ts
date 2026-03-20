import { AppLocale } from './locale.model';

export type LanguageOption = {
  code: AppLocale;
  nativeLabel: string;
  triggerLabel: string;
  enabled: boolean;
};

export const languages: LanguageOption[] = [
  {
    code: 'ru',
    nativeLabel: 'Русский',
    triggerLabel: 'РУ',
    enabled: true,
  },
  {
    code: 'en',
    nativeLabel: 'English',
    triggerLabel: 'ENG',
    enabled: true,
  },
  {
    code: 'es',
    nativeLabel: 'Espanol',
    triggerLabel: 'ESP',
    enabled: true,
  },
];
