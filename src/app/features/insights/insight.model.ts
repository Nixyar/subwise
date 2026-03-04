export type InsightType = 'warning' | 'suggestion' | 'info' | 'trial';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  savings?: number;
}
