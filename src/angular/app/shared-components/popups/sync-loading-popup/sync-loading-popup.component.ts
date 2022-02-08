import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EventBusService, Event } from '../../../core/services/event-bus.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-sync-loading-popup',
  templateUrl: './sync-loading-popup.component.html',
  styleUrls: ['./sync-loading-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyncLoadingPopupComponent implements OnInit, OnDestroy {
  result: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<SyncLoadingPopupComponent>,
    private eventBus: EventBusService,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.sync();
  }

  sync(): void {
    this.result = undefined;
    this.dialogRef.disableClose = true;

    this.odin
      .sync()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => {
          console.log('this result in sync popup: ', this.result);
          this.updateOperatorDataStorage();
          this.result = data;
          this.cdr.markForCheck();

          if (data) {
            setTimeout(() => {
              this.onClose(true);
            }, 3000);
            this.dialogRef.disableClose = false;
          }
        },
        () => {
          this.result = false;
          this.cdr.markForCheck();
        }
      );
  }

  //todo
  private updateOperatorDataStorage(): void {
    this.odin
      .getOperator(this.storage.get('operator-data').id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((operator) => {
        this.storage.set('operator-data', operator.data);
        this.eventBus.dispatch(Event.SYNCED);
      });
  }

  onClose(result?: boolean): void {
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
