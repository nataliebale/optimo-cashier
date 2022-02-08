import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  public subject = new BehaviorSubject<any>(null);

  setData(value) {
    this.subject.next(value);
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
