import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ICredentials } from '../../../../shared/types/ICredentials';
import { ILocation } from '../../../../shared/types/ILocation';
import { LoginData } from './login/setup-login.component';
import { UserType } from '../../../../shared/enums/UserType';
import { OptimoProductType } from '../../../../shared/enums/OptimoProductType';
import { ILegalEntityListModel } from '../../../../shared/types/ILegalEntityListModel';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupComponent {
  credentials: ICredentials;
  legalEntityId: string;
  location: ILocation;
  role: string;
  userType: UserType;
  step: 'login' | 'companies' | 'legalEntity' | 'location' | 'config' = 'login';
  companies: Array<object>;
  productType: OptimoProductType;

  constructor(private cdr: ChangeDetectorRef) {}

  onSignIn(data: LoginData): void {
    this.credentials = data.credentials;

    if (data.hasCompanies) {
      this.step = 'companies';
      this.companies = data.companies;
      return;
    }

    this.role = data.role;
    this.userType = data.userType;
    if (data.role === 'Admin' || data.userType == UserType.Admin) {
      this.step = 'legalEntity';
    } else {
      this.step = 'location';
    }
    this.productType = data.productType;
  }

  onLegalEntityChange(legalEntity: ILegalEntityListModel): void {
    this.legalEntityId = legalEntity.id || legalEntity.uid;
    this.productType = legalEntity.productType;
    this.step = 'location';
  }

  onLocationChange(location: ILocation): void {
    this.location = location;
    this.step = 'config';
  }
}
