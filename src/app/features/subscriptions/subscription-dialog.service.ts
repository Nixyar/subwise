import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddSubscriptionComponent } from './add-subscription.component';
import { ConfirmSubscriptionDeleteDialogComponent } from './confirm-subscription-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class SubscriptionDialogService {
  private readonly dialog = inject(MatDialog);

  openAddDialog() {
    return this.dialog.open(AddSubscriptionComponent, {
      width: 'min(42rem, calc(100vw - 2rem))',
      maxWidth: '42rem',
      autoFocus: false,
      panelClass: 'subscription-dialog-panel',
    });
  }

  openDeleteDialog(data: {
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel: string;
  }) {
    return this.dialog.open(ConfirmSubscriptionDeleteDialogComponent, {
      width: 'min(28rem, calc(100vw - 2rem))',
      maxWidth: '28rem',
      autoFocus: false,
      data,
      panelClass: 'subscription-dialog-panel',
    });
  }
}
