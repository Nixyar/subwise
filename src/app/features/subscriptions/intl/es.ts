import { AddSubscriptionIntl, SubscriptionIntl } from '../../../core/i18n/translations.model';

export const addSubscriptionIntlEs: AddSubscriptionIntl = {
  title: 'Agregar suscripcion',
  subtitle: 'Completa los datos para que la app controle cobros y gastos',
  name: 'Nombre del servicio',
  namePlaceholder: 'Por ejemplo, un servicio de video o almacenamiento',
  price: 'Precio',
  pricePlaceholder: '599',
  currency: 'Moneda',
  cycle: 'Periodo de cobro',
  category: 'Categoria',
  nextBillingDate: 'Fecha del proximo cobro',
  isTrial: 'Este es un periodo de prueba',
  trialEndDate: 'Fecha de fin de la prueba',
  lastUsedDate: 'Ultimo uso (opcional)',
  lastUsedDateHint: 'Nos ayuda a detectar suscripciones olvidadas',
  cancel: 'Cancelar',
  submit: 'Agregar suscripcion',
  monthly: 'Mensual',
  yearly: 'Anual',
};

export const subscriptionsIntlEs: SubscriptionIntl = {
  categories: {
    streaming: 'Streaming',
    music: 'Musica',
    cloud: 'Nube',
    sport: 'Deporte',
    software: 'Software',
    other: 'Otro',
  },
  cycles: {
    month: 'mes',
    year: 'ano',
  },
  currencies: {
    RUB: 'Rublo ruso (₽)',
    USD: 'Dolar estadounidense ($)',
    EUR: 'Euro (€)',
  },
  none: 'sin datos',
};
