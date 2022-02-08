import { MainProcessSetupService } from '../../../core/services/main-process/main-process.setup.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginData } from '../login/setup-login.component';

@Component({
  selector: 'app-setup-companies',
  templateUrl: './setup-companies.component.html',
  styleUrls: ['./setup-companies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupCompaniesComponent implements OnDestroy {
  @Input()
  companies: Array<object>;

  @Input()
  credentials: any;

  @Output()
  back = new EventEmitter<void>();

  @Output()
  signIn = new EventEmitter<LoginData>();

  company: any;

  private unsubscribe$ = new Subject<void>();

  constructor(private setup: MainProcessSetupService) {}

  onSubmit(): void {
    const credentials = {
      ...this.credentials,
      legalEntityId: this.company.id,
    };

    this.setup
      .login(credentials)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        console.log(result);
        this.signIn.emit({
          credentials,
          role: result.data.role,
          userType: result.data.userType,
          tokenType: result.data.tokenType,
          productType: result.data.productType,
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
