import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SubscriptionService } from './subscription.service';
import { Router } from '@angular/router';
import { Category, Currency, Cycle, Subscription } from './subscription.model';
import { LocaleService } from '../../core/i18n/locale.service';
import { translations } from '../../core/i18n/translations';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss',
})
export class AddSubscriptionComponent {
  private fb = inject(FormBuilder);
  private subService = inject(SubscriptionService);
  private localeService = inject(LocaleService);
  router = inject(Router);
  copy = computed(() => translations[this.localeService.locale()].addSubscription);
  readonly currencies: Currency[] = ['RUB', 'USD', 'EUR'];

  form = this.fb.group({
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    currency: ['RUB' as Currency, Validators.required],
    cycle: ['month' as Cycle, Validators.required],
    category: ['streaming' as Category, Validators.required],
    nextBillingDate: ['', Validators.required],
    isTrial: [false],
    trialEndDate: [''],
    lastUsedDate: ['']
  });

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
        nextBillingDate: val.nextBillingDate!,
        isTrial: val.isTrial || false,
        trialEndDate: val.trialEndDate || undefined,
        lastUsedDate: val.lastUsedDate || undefined
      };
      
      this.subService.addSubscription(newSub);
      this.router.navigate(['/']);
    }
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
}
