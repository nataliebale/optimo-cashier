import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ISpace } from '../../../../shared/types/ISpace';

@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.component.html',
  styleUrls: ['./authorized-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutComponent {
  @Input()
  isPaymentPage: boolean;

  @Input()
  openBurgerMenuForShiftStart: boolean;

  @Input()
  selectedTableName: string;

  @Input()
  isHorecaMode: string;

  @Input()
  spaces: ISpace[];

  @Input()
  selectedSpace: ISpace;

  @Input()
  isOrderHistoryPage: boolean;

  @Output()
  selectSpace = new EventEmitter<ISpace>();

  @Input()
  deletePrivilegePassword: boolean;

  @Output()
  checksButtonClicked = new EventEmitter<boolean>();
}
