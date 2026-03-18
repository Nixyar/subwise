import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type ConfirmDeleteDialogData = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
};

@Component({
  selector: 'app-confirm-subscription-delete-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog">
      <h2 class="confirm-dialog__title">{{ data.title }}</h2>
      <p class="confirm-dialog__description">{{ data.description }}</p>

      <div class="confirm-dialog__actions">
        <button mat-button type="button" class="confirm-dialog__secondary" (click)="dialogRef.close(false)">
          {{ data.cancelLabel }}
        </button>
        <button mat-flat-button type="button" class="confirm-dialog__primary" (click)="dialogRef.close(true)">
          {{ data.confirmLabel }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .confirm-dialog {
      padding: 1.5rem;
    }

    .confirm-dialog__title {
      color: #111827;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .confirm-dialog__description {
      margin-top: 0.75rem;
      color: #6b7280;
      line-height: 1.6;
    }

    .confirm-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .confirm-dialog__secondary {
      min-height: 2.75rem;
      padding: 0 1rem;
      border-radius: 0.75rem;
      background: #f3f4f6;
      color: #374151;
    }

    .confirm-dialog__primary {
      min-height: 2.75rem;
      padding: 0 1rem;
      border-radius: 0.75rem;
      background: #dc2626;
      box-shadow: none;
    }
  `,
})
export class ConfirmSubscriptionDeleteDialogComponent {
  readonly data = inject<ConfirmDeleteDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmSubscriptionDeleteDialogComponent, boolean>);
}
