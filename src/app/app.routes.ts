import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard.component';
import { InsightsComponent } from './components/insights.component';
import { SummaryComponent } from './components/summary.component';
import { AddSubscriptionComponent } from './components/add-subscription.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'sovety', component: InsightsComponent },
  { path: 'insights', redirectTo: 'sovety', pathMatch: 'full' },
  { path: 'summary', component: SummaryComponent },
  { path: 'add', component: AddSubscriptionComponent },
  { path: '**', redirectTo: '' }
];
