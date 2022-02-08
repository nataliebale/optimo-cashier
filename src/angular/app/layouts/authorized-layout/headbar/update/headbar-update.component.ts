import { Subject } from 'rxjs';
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
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-headbar-update',
  templateUrl: './headbar-update.component.html',
  styleUrls: ['./headbar-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadbarUpdateComponent implements OnInit, OnDestroy {
  // @Input()
  // updateIsAvaliable: boolean;

  private _updateIsAvaliable: boolean;
  @Input()
  set updateIsAvaliable(value: boolean) {
    console.log('Is update avaliable: ', value);
    this._updateIsAvaliable = value;
  }

  get updateIsAvaliable(): boolean {
    return this._updateIsAvaliable;
  }

  @Output()
  update = new EventEmitter<void>();

  @Output()
  open = new EventEmitter<void>();

  showDropdown: boolean;

  private unsubscribe$ = new Subject<void>();
  appVersion: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getAppVersion();
  }

  private getAppVersion(): void {
    this.odin
      .getAppVer()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        if (data) {
          this.appVersion = data;
          this.cdr.markForCheck();
        }
      });
  }

  onToggleDropdown(e?: Event): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.open.emit();
      this.getAppVersion();
    }
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
