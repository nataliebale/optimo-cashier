import { Subject, Observable } from 'rxjs';
import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Inject,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { DOCUMENT } from '@angular/common';
import { SyncStatus } from '../../../../../../shared/enums/SyncStatus';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-headbar-sync',
  templateUrl: './headbar-sync.component.html',
  styleUrls: ['./headbar-sync.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadbarSyncComponent implements OnInit, OnDestroy {
  private _syncStatus: SyncStatus;

  @Input()
  set syncStatus(value: SyncStatus) {
    this._syncStatus = value;
    this.getLastSyncDate();
  }

  get syncStatus(): SyncStatus {
    return this._syncStatus;
  }

  @Input()
  set openAndStart$(value: Observable<void>) {
    value.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.showDropdown = true;
      this.cdr.markForCheck();
      this.sync.emit();
    });
  }

  @Output()
  sync = new EventEmitter<void>();

  showDropdown: boolean;
  SyncStatus = SyncStatus;

  private unsubscribe$ = new Subject<void>();
  lastSync: Date;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.getLastSyncDate();
  }

  private getLastSyncDate(): void {
    this.odin
      .getLastSyncDate()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        if (data) {
          this.lastSync = data;
          this.cdr.markForCheck();
        }
      });
  }

  onToggleDropdown(e?: Event): void {
    this.showDropdown = !this.showDropdown;

    if (e) {
      e.stopPropagation();
      if (this.showDropdown) {
        this.document.getElementsByTagName('html')[0].click();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
