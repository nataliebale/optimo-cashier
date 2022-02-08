import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MessageData {
  message: string;
  observable$: Observable<any>;
}

@Component({
  selector: 'app-loader-popup',
  templateUrl: './loader-popup.component.html',
  styleUrls: ['./loader-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderPopupComponent implements OnInit, OnDestroy {
  result: boolean;
  dataMessage = this.data.message + 'ვერ განხორციელდა';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<LoaderPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribe();
  }

  subscribe(): void {
    this.result = undefined;

    this.data.observable$.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      console.log('LoaderPopupComponent -> subscribe -> result', result);

      setTimeout(() => {
        this.dialogRef.close(result);
      }, 1000);

      // if (result.err) {
      //   this.result = false;
      // } else {
      //   this.result = true;
      //   this.dialogRef.disableClose = false;
      //   setTimeout(() => {
      //     this.dialogRef.close();
      //   }, 3000);
      // }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
