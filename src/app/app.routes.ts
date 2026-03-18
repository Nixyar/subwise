import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'insight',
    loadComponent: () =>
      import('./features/insights/insights.component').then((m) => m.InsightsComponent),
  },
  { path: 'sovety', redirectTo: 'insight', pathMatch: 'full' },
  { path: 'insights', redirectTo: 'insight', pathMatch: 'full' },
  {
    path: 'summary',
    loadComponent: () =>
      import('./features/summary/summary.component').then((m) => m.SummaryComponent),
  },
  { path: 'add', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
