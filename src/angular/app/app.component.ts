import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import {} from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { BarcodeScannerService } from './services/barcode-scanner.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable, merge } from 'rxjs';
import { takeUntil, mapTo } from 'rxjs/operators';
import { MainProcessAPI } from './core/services/main-process/MainProcessAPI';
import { MainProcessService } from './core/services/main-process/main-process.service';
import { OdinEvent } from '../../shared/enums/OdinEvent';
import { IResult } from '../../shared/types/IResult';
import { IClockDriftStatus } from '../../shared/types/IClockDriftStatus';

declare global {
  interface Window {
    process: any;
    MainProcessAPI: MainProcessAPI;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  showTimeDriftPopup = false;
  constructor(
    private barcodeScanner: BarcodeScannerService,
    private dialog: MatDialog,
    translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef
  ) {
    console.log();
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (window.MainProcessAPI.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit(): void {
    this.adjustZoom();
    this.setTitleBar();
    this.setupBarcodeScannerOnDialogEvent();
    this.listenToTimeDrift();
  }

  listenToTimeDrift() {
    this.odin
      .clockCheckDriftStatus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: IResult<IClockDriftStatus>) => {
        if (res?.err) {
          console.log('error retrieving clock drift status');
        } else {
          this.handleTimeDrift(res?.data);
        }
      });
    this.odin.on(OdinEvent.CLOCK_DRIFT_STATUS, (data: IClockDriftStatus) => {
      this.handleTimeDrift(data);
    });
  }

  private handleTimeDrift(driftStatus: IClockDriftStatus) {
    this.showTimeDriftPopup = driftStatus?.hasClockDriftExceededThreashold === true ? true : false;
    this.cdr.markForCheck();
    if (this.showTimeDriftPopup) {
      this.odin
        .clockWarningShown(driftStatus?.realTime)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((res: IResult<boolean>) => {
          console.log('Clock drift error', res?.data ? 'logged' : 'not logged!');
        });
    }
  }

  private adjustZoom(): void {
    //this.electronService.webFrame.setZoomFactor(0.8);
  }

  private setTitleBar(): void {
    window.MainProcessAPI.setTitleBar();
  }

  private setupBarcodeScannerOnDialogEvent(): void {
    this.dialogEvents.pipe(takeUntil(this.unsubscribe$)).subscribe((open: boolean) => {
      if (open) {
        this.barcodeScanner.stopListening();
      } else {
        this.barcodeScanner.startListening();
      }
    });
  }

  private get dialogEvents(): Observable<boolean> {
    return merge(
      this.dialog.afterOpened.pipe(mapTo(true)),
      this.dialog.afterAllClosed.pipe(mapTo(false))
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
