import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private readonly closeSubject = new Subject<void>();
  close$ = this.closeSubject.asObservable();

  close() {
    this.closeSubject.next();
  }
}
