import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'sovety',
    loadComponent: () =>
      import('./features/insights/insights.component').then((m) => m.InsightsComponent),
  },
  { path: 'insights', redirectTo: 'sovety', pathMatch: 'full' },
  {
    path: 'summary',
    loadComponent: () =>
      import('./features/summary/summary.component').then((m) => m.SummaryComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./features/subscriptions/add-subscription.component').then(
        (m) => m.AddSubscriptionComponent,
      ),
  },
  { path: '**', redirectTo: '' }
];
