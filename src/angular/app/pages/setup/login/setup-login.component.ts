import { MainProcessSetupService } from '../../../core/services/main-process/main-process.setup.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ICredentials } from '../../../../../shared/types/ICredentials';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserType } from '../../../../../shared/enums/UserType';
import { TokenType } from '../../../../../shared/enums/TokenType';
import { NotifierPopupComponent } from '../../../shared-components/popups/notifier-popup/notifier-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';

export interface LoginData {
  credentials: ICredentials;
  role?: string;
  userType?: UserType;
  tokenType?: TokenType;
  hasCompanies?: boolean;
  companies?: Array<object>;
  productType?: OptimoProductType;
}

@Component({
  selector: 'app-setup-login',
  templateUrl: './setup-login.component.html',
  styleUrls: ['./setup-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupLoginComponent implements OnInit, OnDestroy {
  @Output()
  signIn = new EventEmitter<LoginData>();

  form: FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private setup: MainProcessSetupService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignIn(): void {
    const credentials: ICredentials = this.form.getRawValue();

    this.setup
      .login(credentials)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          this.signIn.emit({
            credentials,
            role: result.data.role,
            userType: result.data.userType,
            tokenType: result.data.tokenType,
            productType: result.data.productType,
          });
        },
        (e) => {
          console.error(e);
          if (e && e.errorCode == 22) {
            this.openWrongCredentialsDialog();
          } else if (e && e.errorCode == 34) {
            this.signIn.emit({
              credentials,
              hasCompanies: true,
              companies: e.data.legalEntities,
            });
          }
        }
      );
  }

  private openWrongCredentialsDialog(): void {
    this.dialog.open(NotifierPopupComponent, {
      width: '500px',
      data: {
        message: 'Wrong Credentials!',
        success: false,
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
