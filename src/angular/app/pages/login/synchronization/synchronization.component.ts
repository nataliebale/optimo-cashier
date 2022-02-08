import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { MessagePopupComponent } from '../../../shared-components/popups/message-popup/message-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-synchronization',
  templateUrl: './synchronization.component.html',
  styleUrls: ['./synchronization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SynchronizationComponent implements OnDestroy {
  @Input()
  disabled: boolean;

  @Output()
  sync = new EventEmitter<void>();

  loading: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private storage: LocalStorageService,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  onClick(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.storage.remove('operator-data'); //todo

    this.odin
      .syncOperators()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data, err }) => {
        this.loading = false;
        this.cdr.markForCheck();
        if (!data || err) {
          this.dialog.open(MessagePopupComponent, {
            width: '500px',
            data: {
              message: 'სინქრონიზაცია ვერ განხორციელდა',
              success: false,
            },
          });
          console.log('sync ERROR');
        } else {
          console.log('sync SUCCESS');
          this.sync.emit();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
