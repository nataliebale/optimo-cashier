import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IWifiNetwork } from '../../../../../../shared/types/IWifiNetworksModel';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-wifi-password-popup',
  templateUrl: './wifi-password-popup.component.html',
  styleUrls: ['./wifi-password-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WifiPasswordPopupComponent implements OnDestroy {
  form: FormGroup = this.formBuilder.group({
    password: ['', Validators.required],
  });

  isError: boolean;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private odin: MainProcessService,
    private dialogRef: MatDialogRef<WifiPasswordPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public item: IWifiNetwork,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    const { password } = this.form.getRawValue();
    this.odin
      .connectToWifi({
        ssid: this.item.ssid,
        password,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (!result.data) {
          this.isError = true;
          console.error(
            '🚀 ~ file: wifi-password-popup.component.ts ~ line 48 ~ WifiPasswordPopupComponent ~ .subscribe ~ isError',
            this.isError
          );
          this.cdr.markForCheck();
        } else {
          this.dialogRef.close(true);
        }
      });
  }

  onClose() {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
