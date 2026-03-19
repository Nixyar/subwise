import { DashboardRoutes } from './dashboard.routes';
import { InsightsRoutes } from './insights.routes';
import { SummaryRoutes } from './summary.routes';

export class AppRoutes {
  static add = 'add';
  static wildcard = '**';
}

export const routesMap = {
  dashboard: DashboardRoutes,
  insights: InsightsRoutes,
  summary: SummaryRoutes,
} as const;
