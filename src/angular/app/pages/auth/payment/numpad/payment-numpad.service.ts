import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentNumpadService {
  public keySubject = new Subject<object>();

  setKey(value) {
    this.keySubject.next(value);
  }

  getKey(): Observable<any> {
    return this.keySubject.asObservable();
  }
}
