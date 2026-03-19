import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { languages } from '../i18n/languages';
import { AppLocale } from '../i18n/locale.model';
import { LocaleService, DISPLAY_CURRENCIES } from '../i18n/locale.service';
import { translations } from '../i18n/translations';
import { SubscriptionDialogService } from '../../features/subscriptions/subscription-dialog.service';
import { Currency } from '../../features/subscriptions/subscription.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  readonly localeService = inject(LocaleService);
  readonly subscriptionDialogService = inject(SubscriptionDialogService);
  readonly locale = this.localeService.locale;
  readonly copy = computed(() => translations[this.locale()].layout);
  readonly languages = languages.filter((language) => language.enabled);
  readonly activeLanguage = computed(
    () => this.languages.find((language) => language.code === this.locale()) ?? this.languages[0],
  );
  readonly displayCurrencies = DISPLAY_CURRENCIES;
  readonly activeCurrency = this.localeService.displayCurrency;

  setLocale(locale: AppLocale) {
    this.localeService.setLocale(locale);
  }

  setDisplayCurrency(currency: Currency) {
    this.localeService.setDisplayCurrency(currency);
  }

  openAddSubscriptionDialog() {
    this.subscriptionDialogService.openAddDialog();
  }
}
