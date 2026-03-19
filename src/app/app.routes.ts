import { Routes } from '@angular/router';
import { DashboardRoutes } from './routes/dashboard.routes';
import { InsightsRoutes } from './routes/insights.routes';
import { SummaryRoutes } from './routes/summary.routes';
import { AppRoutes } from './routes/routes';

export const routes: Routes = [
  {
    path: DashboardRoutes.path,
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: InsightsRoutes.path,
    loadComponent: () =>
      import('./features/insights/insights.component').then((m) => m.InsightsComponent),
  },
  { path: InsightsRoutes.legacySovety, redirectTo: InsightsRoutes.path, pathMatch: 'full' },
  { path: InsightsRoutes.legacyInsights, redirectTo: InsightsRoutes.path, pathMatch: 'full' },
  {
    path: SummaryRoutes.path,
    loadComponent: () =>
      import('./features/summary/summary.component').then((m) => m.SummaryComponent),
  },
  { path: AppRoutes.add, redirectTo: DashboardRoutes.path, pathMatch: 'full' },
  { path: AppRoutes.wildcard, redirectTo: DashboardRoutes.path }
];
