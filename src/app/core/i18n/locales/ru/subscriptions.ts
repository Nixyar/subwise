import { AddSubscriptionIntl, SubscriptionIntl } from '../../translations.model';

export const addSubscriptionRu: AddSubscriptionIntl = {
  title: 'Добавить подписку',
  subtitle: 'Заполни данные, чтобы приложение отслеживало списания и расходы',
  name: 'Название сервиса',
  namePlaceholder: 'Например, видеосервис или облако',
  price: 'Стоимость',
  pricePlaceholder: '599',
  currency: 'Валюта',
  cycle: 'Цикл оплаты',
  category: 'Категория',
  nextBillingDate: 'Дата следующего списания',
  isTrial: 'Это пробный период',
  trialEndDate: 'Дата окончания пробного периода',
  lastUsedDate: 'Последний раз использовался (опционально)',
  lastUsedDateHint: 'Поможет нам найти забытые подписки',
  cancel: 'Отмена',
  submit: 'Добавить подписку',
  monthly: 'В месяц',
  yearly: 'В год',
};

export const subscriptionsRu: SubscriptionIntl = {
  categories: {
    streaming: 'Стриминг',
    music: 'Музыка',
    cloud: 'Облако',
    sport: 'Спорт',
    software: 'Софт',
    other: 'Другое',
  },
  cycles: {
    month: 'мес.',
    year: 'год',
  },
  currencies: {
    RUB: 'Российский рубль (₽)',
    USD: 'Доллар США ($)',
    EUR: 'Евро (€)',
  },
  none: 'нет данных',
};
