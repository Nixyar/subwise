import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from './subscription.service';
import { Router } from '@angular/router';
import { Category, Currency, Cycle, Subscription } from './subscription.model';
import { getCurrencyLabel } from '../../core/utils/formatters';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-subscription.component.html',
  styleUrl: './add-subscription.component.scss',
})
export class AddSubscriptionComponent {
  private fb = inject(FormBuilder);
  private subService = inject(SubscriptionService);
  router = inject(Router);
  getCurrencyLabel = getCurrencyLabel;

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
}
