import { Subscription } from '../../features/subscriptions/subscription.model';

export function annualCost(sub: Subscription): number {
  return sub.cycle === 'month' ? sub.price * 12 : sub.price;
}
