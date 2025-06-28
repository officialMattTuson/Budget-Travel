import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private readonly closeSubject = new Subject<any>();
  close$ = this.closeSubject.asObservable();

  close(value?: any) {
    this.closeSubject.next(value);
  }
}
