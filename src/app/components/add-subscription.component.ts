import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { Router } from '@angular/router';
import { Category, Currency, Cycle, Subscription } from '../models/types';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-2xl mx-auto space-y-8">
      <header>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Добавить подписку</h1>
        <p class="text-gray-500 mt-1">Внеси данные, чтобы мы могли их проанализировать</p>
      </header>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Название сервиса</label>
            <input id="name" type="text" formControlName="name" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Netflix, Spotify...">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Цена</label>
              <input id="price" type="number" step="0.01" formControlName="price" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="9.99">
            </div>
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700 mb-1">Валюта</label>
              <select id="currency" formControlName="currency" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RUB">RUB (₽)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="cycle" class="block text-sm font-medium text-gray-700 mb-1">Цикл оплаты</label>
              <select id="cycle" formControlName="cycle" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                <option value="month">В месяц</option>
                <option value="year">В год</option>
              </select>
            </div>
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select id="category" formControlName="category" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                <option value="streaming">Стриминг</option>
                <option value="music">Музыка</option>
                <option value="cloud">Облако</option>
                <option value="sport">Спорт</option>
                <option value="software">Софт</option>
                <option value="other">Другое</option>
              </select>
            </div>
          </div>

          <div>
            <label for="nextBillingDate" class="block text-sm font-medium text-gray-700 mb-1">Дата следующего списания</label>
            <input id="nextBillingDate" type="date" formControlName="nextBillingDate" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
          </div>

          <div class="pt-4 border-t border-gray-100">
            <label for="isTrial" class="flex items-center space-x-3 cursor-pointer">
              <input id="isTrial" type="checkbox" formControlName="isTrial" class="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
              <span class="text-gray-900 font-medium">Это пробный период (Trial)</span>
            </label>
          </div>

          @if (form.get('isTrial')?.value) {
            <div class="pl-8">
              <label for="trialEndDate" class="block text-sm font-medium text-gray-700 mb-1">Дата окончания Trial</label>
              <input id="trialEndDate" type="date" formControlName="trialEndDate" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
          }

          <div>
            <label for="lastUsedDate" class="block text-sm font-medium text-gray-700 mb-1">Последний раз использовался (опционально)</label>
            <input id="lastUsedDate" type="date" formControlName="lastUsedDate" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            <p class="text-xs text-gray-500 mt-1">Поможет нам найти забытые подписки</p>
          </div>
        </div>

        <div class="pt-6 flex space-x-4">
          <button type="button" (click)="router.navigate(['/'])" class="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
            Отмена
          </button>
          <button type="submit" [disabled]="form.invalid" class="flex-1 px-6 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Добавить подписку
          </button>
        </div>
      </form>
    </div>
  `
})
export class AddSubscriptionComponent {
  private fb = inject(FormBuilder);
  private subService = inject(SubscriptionService);
  router = inject(Router);

  form = this.fb.group({
    name: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    currency: ['USD' as Currency, Validators.required],
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
