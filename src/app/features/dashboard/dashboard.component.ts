import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { MatIconModule } from '@angular/material/icon';
import { LocaleService } from '../../core/i18n/locale.service';
import { interpolate } from '../../core/i18n/interpolate';
import { translations } from '../../core/i18n/translations';
import { Category, Currency, Cycle, Subscription } from '../subscriptions/subscription.model';
import { MatButtonModule } from '@angular/material/button';
import { SubscriptionDialogService } from '../subscriptions/subscription-dialog.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

type DashboardSort = 'term' | 'priceDesc' | 'priceAsc' | 'name';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly failedBrandIcons = signal<Record<string, true>>({});

  readonly subService = inject(SubscriptionService);
  readonly localeService = inject(LocaleService);
  readonly subscriptionDialogService = inject(SubscriptionDialogService);
  readonly copy = computed(() => translations[this.localeService.locale()].dashboard);
  readonly searchQuery = signal('');
  readonly selectedCategories = signal<Category[]>([]);
  readonly sort = signal<DashboardSort>('term');
  readonly categoryOptions: Category[] = ['streaming', 'music', 'cloud', 'sport', 'software', 'other'];
  readonly visibleSubscriptions = computed(() => {
    const filtered = this.getFilteredSubscriptions(this.subService.subscriptions());
    return this.getSortedSubscriptions(filtered);
  });

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'streaming': 'live_tv',
      'music': 'music_note',
      'cloud': 'cloud',
      'sport': 'fitness_center',
      'software': 'computer',
      'other': 'category'
    };
    return icons[category] || 'category';
  }

  formatMoney(amount: number, currency: Currency = 'USD'): string {
    return this.localeService.formatInDisplayCurrency(amount, currency);
  }

  monthlyTotalText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.subService.subscriptions()
        .filter((sub) => !sub.isTrial)
        .map((sub) => ({
          amount: sub.cycle === 'month' ? sub.price : sub.price / 12,
          currency: sub.currency,
        }))
    );
  }

  yearlyTotalText(): string {
    return this.localeService.formatMoneyBreakdown(
      this.subService.subscriptions()
        .filter((sub) => !sub.isTrial)
        .map((sub) => ({
          amount: sub.cycle === 'month' ? sub.price * 12 : sub.price,
          currency: sub.currency,
        }))
    );
  }

  formatDate(date: string): string {
    return this.localeService.formatDate(date);
  }

  openAddSubscriptionDialog() {
    this.subscriptionDialogService.openAddDialog();
  }

  setSearchQuery(value: string) {
    this.searchQuery.set(value);
  }

  toggleCategory(category: Category) {
    this.selectedCategories.update((selectedCategories) =>
      selectedCategories.includes(category)
        ? selectedCategories.filter((selectedCategory) => selectedCategory !== category)
        : [...selectedCategories, category]
    );
  }

  resetCategories() {
    this.selectedCategories.set([]);
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories().includes(category);
  }

  setSort(sort: DashboardSort) {
    this.sort.set(sort);
  }

  getSortLabel(): string {
    switch (this.sort()) {
      case 'priceDesc':
        return this.copy().sortPriceDesc;
      case 'priceAsc':
        return this.copy().sortPriceAsc;
      case 'name':
        return this.copy().sortName;
      case 'term':
      default:
        return this.copy().sortTerm;
    }
  }

  getCategoryFilterLabel(): string {
    const selectedCategories = this.selectedCategories();

    if (selectedCategories.length === 0) {
      return this.copy().categoryAll;
    }

    if (selectedCategories.length === this.categoryOptions.length) {
      return this.copy().categoryAll;
    }

    if (selectedCategories.length === 1) {
      return this.getCategoryName(selectedCategories[0]);
    }

    return `${this.copy().categorySelected}: ${selectedCategories.length}`;
  }

  areAllCategoriesSelected(): boolean {
    return this.selectedCategories().length === this.categoryOptions.length;
  }

  isCategoryFilterEmpty(): boolean {
    return this.selectedCategories().length === 0;
  }

  deleteSubscription(id: string, name: string) {
    const subscription = this.subService.subscriptions().find((sub) => sub.id === id);
    if (!subscription) {
      return;
    }

    this.subscriptionDialogService
      .openDeleteDialog({
        title: this.copy().deleteConfirmTitle,
        description: `${name}. ${this.copy().deleteConfirmDescription}`,
        confirmLabel: this.copy().deleteConfirmSubmit,
        cancelLabel: translations[this.localeService.locale()].addSubscription.cancel,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.subService.removeSubscription(id);
        }
      });
  }

  openSubscriptionManagement(url: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  hasWebsite(subscription: Subscription): boolean {
    return Boolean(subscription.website?.trim());
  }

  shouldShowBrandImage(subscription: Subscription): boolean {
    return Boolean(this.getBrandIconUrl(subscription));
  }

  getBrandIconUrl(subscription: Subscription): string | null {
    if (this.failedBrandIcons()[subscription.id]) {
      return this.getWebsiteFaviconUrl(subscription);
    }

    if (subscription.iconSlug) {
      const color = subscription.brandColor?.replace('#', '');
      return color
        ? `https://cdn.simpleicons.org/${subscription.iconSlug}/${color}`
        : `https://cdn.simpleicons.org/${subscription.iconSlug}`;
    }

    return this.getWebsiteFaviconUrl(subscription);
  }

  handleBrandIconError(subscription: Subscription) {
    if (!subscription.iconSlug) {
      return;
    }

    this.failedBrandIcons.update((failed) => ({ ...failed, [subscription.id]: true }));
  }

  getCategoryName(category: string): string {
    return translations[this.localeService.locale()].subscriptions.categories[category as Category];
  }

  getTopCategoryLabel(): string {
    if (this.subService.subscriptions().length === 0) {
      return translations[this.localeService.locale()].subscriptions.none;
    }

    return this.getCategoryName(this.getTopCategory());
  }

  getCycleLabel(cycle: Cycle): string {
    return translations[this.localeService.locale()].subscriptions.cycles[cycle];
  }

  getTrialLabel(): string {
    return this.copy().trial;
  }

  getScoreText(): string {
    return interpolate(this.copy().scoreText, {
      count: this.subService.subscriptions().length,
    });
  }

  getBillingStatus(days: number, nextBillingDate: string): string {
    if (days === 0) {
      return this.copy().billedToday;
    }

    if (days === 1) {
      return this.copy().billedTomorrow;
    }

    if (days > 1 && days <= 3) {
      return interpolate(this.copy().billedIn, {
        days,
        label: this.localeService.getDaysLabel(days),
      });
    }

    return interpolate(this.copy().billingDate, {
      date: this.formatDate(nextBillingDate),
    });
  }

  daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.round((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  getConicGradient(): string {
    const totals = this.getCategoryTotals();
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    if (total === 0) return 'conic-gradient(#f3f4f6 0% 100%)';

    const colors: Record<string, string> = {
      'streaming': '#ef4444',
      'music': '#10b981',
      'cloud': '#3b82f6',
      'sport': '#f59e0b',
      'software': '#8b5cf6',
      'other': '#6b7280'
    };

    let gradient = 'conic-gradient(';
    let currentAngle = 0;
    for (const [cat, val] of Object.entries(totals)) {
      const percentage = (val / total) * 100;
      gradient += `${colors[cat] || colors['other']} ${currentAngle}% ${currentAngle + percentage}%, `;
      currentAngle += percentage;
    }
    gradient = gradient.slice(0, -2) + ')';
    return gradient;
  }

  private getCategoryTotals(): Record<string, number> {
    const subs = this.subService.subscriptions().filter((sub) => !sub.isTrial);
    const currencies = new Set(subs.map((sub) => sub.currency));

    if (currencies.size <= 1) {
      return this.subService.categoryTotals();
    }

    return subs.reduce<Record<string, number>>((totals, sub) => {
      totals[sub.category] = (totals[sub.category] || 0) + 1;
      return totals;
    }, {});
  }

  private getTopCategory(): string {
    const totals = this.getCategoryTotals();
    let max = 0;
    let top = 'other';

    for (const [category, value] of Object.entries(totals)) {
      if (value > max) {
        max = value;
        top = category;
      }
    }

    return top;
  }

  private getSortedSubscriptions(subscriptions: Subscription[]): Subscription[] {
    return [...subscriptions].sort((left, right) => {
      switch (this.sort()) {
        case 'priceDesc':
          return this.compareByMonthlyPrice(right, left);
        case 'priceAsc':
          return this.compareByMonthlyPrice(left, right);
        case 'name':
          return this.compareByName(left, right);
        case 'term':
        default:
          return this.compareByBillingDate(left, right);
      }
    });
  }

  private getFilteredSubscriptions(subscriptions: Subscription[]): Subscription[] {
    return subscriptions.filter((subscription) => {
      const matchesSearch = subscription.name
        .toLocaleLowerCase()
        .includes(this.searchQuery().trim().toLocaleLowerCase());
      const selectedCategories = this.selectedCategories();
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(subscription.category);
      return matchesSearch && matchesCategory;
    });
  }

  private compareByBillingDate(left: Subscription, right: Subscription): number {
    return (
      new Date(left.nextBillingDate).getTime() - new Date(right.nextBillingDate).getTime() ||
      left.name.localeCompare(right.name)
    );
  }

  private compareByMonthlyPrice(left: Subscription, right: Subscription): number {
    return (
      this.getMonthlyComparablePrice(left) - this.getMonthlyComparablePrice(right) ||
      this.compareByBillingDate(left, right)
    );
  }

  private compareByName(left: Subscription, right: Subscription): number {
    return left.name.localeCompare(right.name) || this.compareByBillingDate(left, right);
  }

  private getMonthlyComparablePrice(subscription: Subscription): number {
    return subscription.cycle === 'year' ? subscription.price / 12 : subscription.price;
  }

  private getWebsiteFaviconUrl(subscription: Subscription): string | null {
    if (!subscription.website) {
      return null;
    }

    return `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(subscription.website)}`;
  }
}
