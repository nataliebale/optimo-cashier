import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IWifiNetwork } from '../../../../../shared/types/IWifiNetworksModel';
import { IWifiStatusModel } from '../../../../../shared/types/IWifiStatusModel';
import { WifiPasswordPopupComponent } from './password/wifi-password-popup.component';

@Component({
  selector: 'app-wifi-popup',
  templateUrl: './wifi-popup.component.html',
  styleUrls: ['./wifi-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WifiPopupComponent implements OnInit, OnDestroy {
  wifiNetworks: IWifiNetwork[];
  activeWifiNetwork: IWifiStatusModel;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<WifiPopupComponent>,
    private odin: MainProcessService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getWifiNetworks();
    this.getWifiStatus();
  }

  private getWifiNetworks(): void {
    this.odin
      .getWifiNetworks()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.wifiNetworks = result.data.networks;
        this.cdr.markForCheck();
        console.log(11111111111, this.wifiNetworks);
      });
  }

  private getWifiStatus(): void {
    this.odin
      .getWifiStatus()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.activeWifiNetwork = result.data;
        this.cdr.markForCheck();
        console.log('active', this.activeWifiNetwork);
      });
  }

  openWifiPasswordPopup(item: IWifiNetwork): void {
    // todo
    if (item.authentication === 'Open') {
      this.connectToFreeWifi(item.ssid);
      return;
    }

    this.dialog
      .open(WifiPasswordPopupComponent, {
        width: '600px',
        data: item,
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.onClose();
        }
      });
  }

  private connectToFreeWifi(ssid: string): void {
    this.odin
      .connectToWifi({
        ssid,
        password: '', // todo
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (!result.err) {
          this.onClose();
        }
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
