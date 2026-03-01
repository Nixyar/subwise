import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { languages } from '../i18n/languages';
import { LocaleService } from '../i18n/locale.service';
import { translations } from '../i18n/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  readonly localeService = inject(LocaleService);
  readonly locale = this.localeService.locale;
  readonly copy = computed(() => translations[this.locale()].layout);
  readonly languages = languages.filter((language) => language.enabled);
  readonly activeLanguage = computed(
    () => this.languages.find((language) => language.code === this.locale()) ?? this.languages[0],
  );

  setLocale(locale: 'ru' | 'en') {
    this.localeService.setLocale(locale);
  }
}
