import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReturnAmountService {
  public subject = new BehaviorSubject<any>(null);

  setValue(value) {
    this.subject.next(value);
  }

  getValue(): Observable<any> {
    return this.subject.asObservable();
  }
}
