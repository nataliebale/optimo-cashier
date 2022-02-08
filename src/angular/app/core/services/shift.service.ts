import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IShift } from '../../../../shared/types/IShift';
import { MainProcessService } from './main-process/main-process.service';
import { IResult } from '../../../../shared/types/IResult';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private request$ = new Subject<void>();
  private _shift$ = new BehaviorSubject<IShift>(null);

  readonly valueChanges = this._shift$.asObservable();

  constructor(private odin: MainProcessService) {
    console.log('ShiftService -> constructor');

    this.request$.pipe(switchMap(() => this.sideEffect)).subscribe(({ data }) => {
      this._shift$.next(data);
    });
  }

  private get sideEffect(): Observable<IResult<IShift>> {
    return this.odin.getShift();
  }

  dispatch(): void {
    this.request$.next();
  }

  setValue(value: IShift): void {
    this._shift$.next(value);
  }

  get currentShift(): IShift {
    return this._shift$.getValue();
  }
}
