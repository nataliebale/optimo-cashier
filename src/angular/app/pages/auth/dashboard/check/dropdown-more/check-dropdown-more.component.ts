import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ICheck } from '../../../../../../../shared/types/ICheck';
import { ICheckItem } from '../../../../../../../shared/types/ICheckItem';
import { OptimoProductType } from '../../../../../../../shared/enums/OptimoProductType';
import { MainProcessService } from '../../../../../core/services/main-process/main-process.service';
import { IOperator } from '../../../../../../../shared/types/IOperator';

@Component({
  selector: 'app-check-dropdown-more',
  templateUrl: './check-dropdown-more.component.html',
  styleUrls: ['./check-dropdown-more.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckDropdownMoreComponent implements OnInit {
  @Input() checks: ICheck[];
  @Input() activeCheck: ICheck;
  @Input() checkProducts: ICheckItem[];
  @Input() showGuestsButton: boolean;
  @Input() showTableChangeButton: boolean;
  @Input() showOperatorChangeButton: boolean;
  @Input() operatorData: IOperator;
  @Input() showChangeTaxRateButton: boolean;
  @Input() checkTaxRateIsOff: boolean;
  @Input() globalTaxRate: number;
  @Output() deleteCurrentCheck = new EventEmitter<void>();
  @Output() changeTable = new EventEmitter<void>();
  @Output() changeOperator = new EventEmitter<void>();
  @Output() clearCurrentCheck = new EventEmitter<void>();
  @Output() updateGuestCount = new EventEmitter<void>();
  @Output() changeTaxRate = new EventEmitter<void>();
  showDropdown = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _mainProcessService: MainProcessService
  ) {}

  ngOnInit(): void {}

  onToggleDropdown(e?: Event): void {
    this.showDropdown = !this.showDropdown;
    if (e) {
      e.stopPropagation();
      if (this.showDropdown) {
        this.document.getElementsByTagName('html')[0].click();
      }
    }
  }

  checkDeleteDisableState(): boolean {
    return (
      !this.activeCheck ||
      (this.checks.length === 1 &&
        this._mainProcessService.settings.productType === OptimoProductType.Retail)
      // || !this.checks.length
    );
  }
}
