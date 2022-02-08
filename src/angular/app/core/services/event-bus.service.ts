import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum Event {
  SYNCED,
  CAN_DELETE,
  SWITCH_ENTITY,
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private _event$ = new Subject<{ event: Event; data: any }>();

  on(e?: Event) {
    let observable = this._event$.asObservable();
    if (e || e === 0) {
      observable = observable.pipe(filter(({ event }) => event === e));
    }
    return observable.pipe(map(({ data }) => data));
  }

  dispatch(event: Event, data?: any): void {
    this._event$.next({ event, data });
  }
}
