import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly snackBar: MatSnackBar) {}

  clear() {
    this.snackBar.dismiss();
  }

  error(message: string) {
    this.alert(message, {
      panelClass: 'fail',
      duration: 8000,
    });
  }

  success(message: string) {
    this.alert(message, {
      panelClass: 'success',
      duration: 4000,
    });
  }

  private alert(message: string, config?: MatSnackBarConfig, action = 'close') {
    this.snackBar.open(message, action, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      ...config,
    });
  }
}
