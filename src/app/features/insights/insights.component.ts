import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightService } from './insight.service';
import { MatIconModule } from '@angular/material/icon';
import { formatMoney } from '../../core/utils/formatters';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.scss',
})
export class InsightsComponent {
  insightService = inject(InsightService);
  formatMoney = formatMoney;

  getIcon(type: string): string {
    switch (type) {
      case 'warning': return 'warning';
      case 'suggestion': return 'lightbulb';
      case 'info': return 'info';
      case 'trial': return 'timer';
      default: return 'lightbulb';
    }
  }
}
