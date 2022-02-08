import { MainProcessSetupService } from '../../../core/services/main-process/main-process.setup.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISetupConfig } from '../../../../../shared/types/ISetupConfig';
import { OdinCashierProvider } from '../../../../../shared/enums/OdinCashierProvider';
import { OdinCardProvider } from '../../../../../shared/enums/OdinCardProvider';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { ILocation } from '../../../../../shared/types/ILocation';
import { OdinPrinterProvider } from '../../../../../shared/enums/OdinPrinterProvider';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';

@Component({
  selector: 'app-setup-config',
  templateUrl: './setup-config.component.html',
  styleUrls: ['./setup-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupConfigComponent implements OnInit, OnDestroy {
  @Input()
  legalEntityId: string;

  @Input()
  location: ILocation;

  @Output()
  back = new EventEmitter<void>();

  @Input()
  productType: OptimoProductType;

  form: FormGroup;

  cashierTypes = [
    { value: OdinCashierProvider.NONE, text: 'არცერთი' },
    { value: OdinCashierProvider.DAISY, text: 'დეიზი' },
    { value: OdinCashierProvider.KASA, text: 'კასა' },
  ];

  cardTypes = [
    { value: 0, text: 'არაინტეგრირებული' },
    { value: 1, text: 'ინტეგრირებული საქართველოს ბანკის' },
    // { value: 2, text: 'ინტეგრირებული საქართველოს ბანკის (პრინტერით)' }
  ];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private odin: MainProcessService,
    private setup: MainProcessSetupService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      cashier: [null, Validators.required],
      card: [null, Validators.required],
      hasReceiptPrinter: [false],
      receiptTitle: [{ value: null, disabled: true }],
      isFullScreen: [true],
      cashBox: [false],
    });
  }

  setConfiguration(): void {
    const configRaw = this.form.getRawValue();
    console.log(configRaw);
    const config: ISetupConfig = {
      cashier: OdinCashierProvider.NONE,
      card: [],
      bogConfiguration: null,
      receiptPrinter: OdinPrinterProvider.NONE,
      isFullScreen: configRaw.isFullScreen,
      hasCashBox: configRaw.cashBox,
      legalEntityId: this.legalEntityId,
      locationId: this.location.id,
      productType: this.productType,
    };

    if (configRaw.cashier) {
      config.cashier = parseInt(configRaw.cashier);
    }

    if (configRaw.card) {
      switch (configRaw.card) {
        case 1:
          config.card.push(OdinCardProvider.BOG);
          config.bogConfiguration = { hasPrinter: false };
          break;
        case 2:
          config.card.push(OdinCardProvider.BOG);
          config.bogConfiguration = { hasPrinter: true };
          break;
        default:
          config.card.push(OdinCardProvider.NONE);
          break;
      }
    }

    if (configRaw.hasReceiptPrinter) {
      config.receiptPrinter = OdinPrinterProvider.THERMAL;
      config.printerSettings = {
        title: configRaw.receiptTitle,
      };
    } else {
      switch (config.cashier) {
        case OdinCashierProvider.DAISY: {
          config.receiptPrinter = OdinPrinterProvider.DAISY;
          break;
        }
        case OdinCashierProvider.KASA: {
          config.receiptPrinter = OdinPrinterProvider.KASA;
          break;
        }
        default: {
          config.receiptPrinter = OdinPrinterProvider.NONE;
        }
      }
    }

    this.setup
      .setConfig(config)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        alert('კონფიგურაცია შენახულია. აპლიკაცია გადაიტვირთება');
        this.odin.relaunch();
      });
  }

  onHasPrinterChange({ target }): void {
    const { receiptTitle } = this.form.controls;
    if (target.checked) {
      receiptTitle.enable();
      receiptTitle.setValidators(Validators.required);
    } else {
      receiptTitle.disable();

      receiptTitle.clearValidators();
      receiptTitle.setValue('');
    }
    receiptTitle.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
