import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TSubscriptionSuggestion } from './subscription-suggestion.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionSuggestionsService {
  private readonly http = inject(HttpClient);

  readonly suggestions = signal<TSubscriptionSuggestion[]>([]);

  constructor() {
    this.loadSuggestions();
  }

  private loadSuggestions() {
    this.http
      .get<TSubscriptionSuggestion[]>('/subscription-suggestions.json')
      .subscribe((suggestions) => this.suggestions.set(suggestions));
  }
}
