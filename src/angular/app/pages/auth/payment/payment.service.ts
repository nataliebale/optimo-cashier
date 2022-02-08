import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  public paymentSubject = new BehaviorSubject<any>(null);
  public submitSubject = new BehaviorSubject<any>(null);

  setPayment(value) {
    this.paymentSubject.next(value);
  }

  setSubmitValue(value) {
    this.submitSubject.next(value);
  }

  getPayment(): Observable<any> {
    return this.paymentSubject.asObservable();
  }

  getSubmitValue(): Observable<any> {
    return this.submitSubject.asObservable();
  }
}
