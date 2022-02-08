import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PincodeComponent implements OnInit, OnDestroy {
  @Input()
  reset$: Observable<void>;

  @Input()
  disabled: boolean;

  @Output()
  filled = new EventEmitter<string>();

  private _pincode = '';

  set pincode(value: string) {
    if (this.disabled || value.length > 4) {
      return;
    }
    this._pincode = value;
    this.error = false;
    this.cdr.markForCheck();
    if (value.length === 4) {
      this.filled.emit(value);
    }
  }

  get pincode(): string {
    return this._pincode;
  }

  error: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.reset$.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.error = this.pincode.length === 4;
      this._pincode = '';
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
