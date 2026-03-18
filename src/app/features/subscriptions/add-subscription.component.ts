import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubscriptionService } from './subscription.service';
import { Category, Currency, Cycle, Subscription } from './subscription.model';
import { LocaleService } from '../../core/i18n/locale.service';
import { translations } from '../../core/i18n/translations';

function startOfDay(value: Date) {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
}

function notInPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const selected = startOfDay(new Date(value));
    const today = startOfDay(new Date());
    return selected < today ? { pastDate: true } : null;
  };
}

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }],
})
export class AddSubscriptionComponent {
  private fb = inject(FormBuilder);
  private subService = inject(SubscriptionService);
  private localeService = inject(LocaleService);
  private dialogRef = inject(MatDialogRef<AddSubscriptionComponent, Subscription | undefined>, { optional: true });
  copy = computed(() => translations[this.localeService.locale()].addSubscription);
  readonly currencies: Currency[] = ['RUB', 'USD', 'EUR'];
  readonly russianDatePlaceholder = 'дд.мм.гггг';
  readonly today = startOfDay(new Date());

  form = this.fb.group({
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    currency: [this.getDefaultCurrency(), Validators.required],
    cycle: ['month' as Cycle, Validators.required],
    category: ['streaming' as Category, Validators.required],
    nextBillingDate: [null as Date | null, [Validators.required, notInPastValidator()]],
    isTrial: [false],
    trialEndDate: [null as Date | null],
    lastUsedDate: [null as Date | null]
  });

  constructor() {
    const updateTrialValidators = (isTrialEnabled: boolean) => {
      const trialEndDateControl = this.form.controls.trialEndDate;

      if (isTrialEnabled) {
        trialEndDateControl.addValidators([Validators.required, notInPastValidator()]);
      } else {
        trialEndDateControl.clearValidators();
        trialEndDateControl.setValue(null);
      }

      trialEndDateControl.updateValueAndValidity({ emitEvent: false });
    };

    updateTrialValidators(this.form.controls.isTrial.value ?? false);
    this.form.controls.isTrial.valueChanges.subscribe((isTrial) => updateTrialValidators(isTrial ?? false));
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
        nextBillingDate: this.toIsoDate(val.nextBillingDate as Date),
        isTrial: val.isTrial || false,
        trialEndDate: val.trialEndDate ? this.toIsoDate(val.trialEndDate as Date) : undefined,
        lastUsedDate: val.lastUsedDate ? this.toIsoDate(val.lastUsedDate as Date) : undefined
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
