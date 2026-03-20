import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubscriptionService } from './subscription.service';
import { Category, Currency, Cycle, Subscription } from './subscription.model';
import { LocaleService } from '../../core/i18n/locale.service';
import { translations } from '../../core/i18n/translations';
import { SUBSCRIPTION_DATE_FORMATS, SubscriptionDateAdapter } from './subscription-date-adapter';
import { createNotInPastValidator, startOfDay } from './add-subscription-form.utils';
import { SubscriptionSuggestionsService } from './subscription-suggestions.service';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: SubscriptionDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: SUBSCRIPTION_DATE_FORMATS },
  ],
})
export class AddSubscriptionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly subService = inject(SubscriptionService);
  private readonly localeService = inject(LocaleService);
  private readonly suggestionsService = inject(SubscriptionSuggestionsService);
  private readonly dialogRef = inject(MatDialogRef<AddSubscriptionComponent, Subscription | undefined>, { optional: true });
  private readonly nameQuery = signal('');

  readonly copy = computed(() => translations[this.localeService.locale()].addSubscription);
  readonly currencies: Currency[] = ['RUB', 'USD', 'EUR'];
  readonly russianDatePlaceholder = 'дд.мм.гггг';
  readonly today = startOfDay(new Date());
  readonly suggestions = computed(() => this.suggestionsService.suggestions());
  readonly filteredSuggestions = computed(() => {
    const query = this.nameQuery().trim().toLowerCase();
    if (!query) {
      return [];
    }

    return this.suggestions().filter((suggestion) =>
      suggestion.keywords.some((keyword) => keyword.includes(query)) ||
      suggestion.name.toLowerCase().includes(query),
    );
  });

  readonly form = this.fb.group({
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    currency: [this.getDefaultCurrency(), Validators.required],
    cycle: ['month' as Cycle, Validators.required],
    category: ['streaming' as Category, Validators.required],
    website: [''],
    nextBillingDate: [null as Date | null, [Validators.required, createNotInPastValidator()]],
    isTrial: [false],
    trialEndDate: [null as Date | null],
    lastUsedDate: [null as Date | null],
    iconSlug: [''],
    brandColor: [''],
  });

  constructor() {
    const updateTrialValidators = (isTrialEnabled: boolean) => {
      const trialEndDateControl = this.form.controls.trialEndDate;

      if (isTrialEnabled) {
        trialEndDateControl.addValidators([Validators.required, createNotInPastValidator()]);
      } else {
        trialEndDateControl.clearValidators();
        trialEndDateControl.setValue(null);
      }

      trialEndDateControl.updateValueAndValidity({ emitEvent: false });
    };

    updateTrialValidators(this.form.controls.isTrial.value ?? false);
    this.form.controls.isTrial.valueChanges.subscribe((isTrial) => updateTrialValidators(isTrial ?? false));
    this.form.controls.name.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.nameQuery.set(value ?? ''));
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      const newSub: Subscription = {
        id: Math.random().toString(36).substring(2, 9),
        name: val.name!,
        price: Number(val.price),
        currency: val.currency as Currency,
        cycle: val.cycle as Cycle,
        category: val.category as Category,
        website: val.website?.trim() || undefined,
        nextBillingDate: this.toIsoDate(val.nextBillingDate as Date),
        isTrial: val.isTrial || false,
        trialEndDate: val.trialEndDate ? this.toIsoDate(val.trialEndDate as Date) : undefined,
        lastUsedDate: val.lastUsedDate ? this.toIsoDate(val.lastUsedDate as Date) : undefined,
        iconSlug: val.iconSlug?.trim() || undefined,
        brandColor: val.brandColor?.trim() || undefined,
      };

      this.subService.addSubscription(newSub);
      this.dialogRef?.close(newSub);
    }
  }

  close() {
    this.dialogRef?.close();
  }

  getCurrencyLabel(currency: Currency): string {
    return translations[this.localeService.locale()].subscriptions.currencies[currency];
  }

  getCategoryLabel(category: Category): string {
    return translations[this.localeService.locale()].subscriptions.categories[category];
  }

  getCycleLabel(cycle: Cycle): string {
    return this.copy()[cycle === 'month' ? 'monthly' : 'yearly'];
  }

  sanitizePriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^\d.,]/g, '').replace(',', '.');
    this.form.controls.price.setValue(input.value ? Number(input.value) : null);
  }

  preventInvalidPriceKeys(event: KeyboardEvent) {
    if (['-', '+', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
    }
  }

  maskDateInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    let maskedValue = digits;

    if (digits.length > 2) {
      maskedValue = `${digits.slice(0, 2)}.${digits.slice(2)}`;
    }

    if (digits.length > 4) {
      maskedValue = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
    }

    input.value = maskedValue;
  }

  preventInvalidDateKeys(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'];
    if (allowedKeys.includes(event.key) || /^\d$/.test(event.key)) {
      return;
    }

    event.preventDefault();
  }

  getDateError(controlName: 'nextBillingDate' | 'trialEndDate'): string {
    const control = this.form.controls[controlName];

    if (!control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return this.localeService.locale() === 'ru' ? 'Выбери дату' : 'Pick a date';
    }

    if (control.hasError('pastDate')) {
      return this.localeService.locale() === 'ru'
        ? 'Дата не может быть в прошлом'
        : 'The date cannot be in the past';
    }

    if (control.hasError('matDatepickerParse')) {
      return this.localeService.locale() === 'ru'
        ? 'Введите дату в формате ДД.ММ.ГГГГ'
        : 'Use the DD.MM.YYYY format';
    }

    return '';
  }

  applySuggestion(name: string) {
    const suggestion = this.suggestions().find((entry) => entry.name === name);
    if (!suggestion) {
      return;
    }

    this.form.patchValue({
      name: suggestion.name,
      price: suggestion.price,
      currency: suggestion.currency,
      category: suggestion.category,
      website: suggestion.website ?? '',
      iconSlug: suggestion.iconSlug ?? '',
      brandColor: suggestion.brandColor ?? '',
    });
    this.nameQuery.set(suggestion.name);
  }

  private getDefaultCurrency(): Currency {
    const appLocale = this.localeService.locale();
    if (appLocale === 'ru') {
      return 'RUB';
    }

    if (appLocale === 'en') {
      return 'USD';
    }

    if (typeof navigator === 'undefined') {
      return 'EUR';
    }

    const language = navigator.language.toLowerCase();
    if (language.startsWith('ru')) {
      return 'RUB';
    }

    if (language.startsWith('en')) {
      return 'USD';
    }

    return 'EUR';
  }

  private toIsoDate(value: Date): string {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
