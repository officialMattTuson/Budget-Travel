import { Component, Inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { BaseFormComponent } from '../base-form.component';
import { NgComponentOutlet } from '@angular/common';
import { PopupService } from '../../../services/shared/popup.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-popup-form',
  imports: [MaterialModule, NgComponentOutlet],
  templateUrl: './popup-form.component.html',
  styleUrl: './popup-form.component.scss',
})
export class PopupFormComponent {
  private readonly destroy$ = new Subject<void>();
  @ViewChild(NgComponentOutlet, { read: NgComponentOutlet })
  outlet!: NgComponentOutlet;

  constructor(
    public readonly dialogRef: MatDialogRef<PopupFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      formComponent: ComponentType<BaseFormComponent>;
    },
    private readonly popupService: PopupService
  ) {
    this.popupService.close$.subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
