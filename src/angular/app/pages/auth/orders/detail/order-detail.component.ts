import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IPurchaseOrder } from '../../../../../../shared/types/IPurchaseOrder';
import { MessagePopupComponent } from '../../../../shared-components/popups/message-popup/message-popup.component';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmited: boolean;
  focusedFormControl: FormControl;
  numpadCoordinates: { x: number; y: number; openTop?: boolean };
  private customPannelClasses = ['custom__dialog'];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<OrderDetailComponent>,
    private odin: MainProcessService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public order: IPurchaseOrder,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(this.order);
    this.createForm();
  }

  private MoreThan(than: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (than >= Number.parseFloat(control.value)) {
          return { moreThan: true };
        }
      }
      return null;
    };
  }

  private createForm(): void {
    const controlsConfig = this.order.purchaseOrderLines.reduce((p, c) => {
      p[`receivedQuantity_${c.id}`] = [c.orderedQuantity, Validators.required];
      p[`receivedUnitCost_${c.id}`] = [c.expectedUnitCost, [Validators.required, this.MoreThan(0)]];
      return p;
    }, {});

    this.form = this.formBuilder.group(controlsConfig);

    // need for update view coused by angular can not handle multiple formcontrol
    this.form.valueChanges
      .pipe(distinctUntilChanged(isEqual), takeUntil(this.unsubscribe$))
      .subscribe((v) => {
        this.form.setValue(v, { emitEvent: false });
      });
  }

  onSubmit(): void {
    this.isSubmited = true;

    const rawValue = this.form.getRawValue();
    const orderLines = this.order.purchaseOrderLines.map((element) => ({
      id: element.id,
      receivedQuantity: rawValue[`receivedQuantity_${element.id}`],
      receivedUnitCost: rawValue[`receivedUnitCost_${element.id}`],
    }));
    // this.openMessagePopup(true);
    this.odin
      .receiveOrder({
        id: this.order.id,
        receiveDate: new Date(),
        orderLines,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.openMessagePopup(result.data);
      });
  }

  private openMessagePopup(result: boolean): void {
    const dialog = this.dialog.open(MessagePopupComponent, {
      width: '500px',
      data: {
        message: result ? 'შეკვეთა წარმატებით იქნა მიღებული' : 'შეკვეთის მიღება ვერ მოხერხდა',
        success: result,
      },
    });

    setTimeout(() => {
      dialog.close();
    }, 3000);

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.dialogRef.close(result);
      });
  }

  onNumpadFocusOut(e: any): void {
    if (e.tagName === 'INPUT') {
      return;
    }
    this.focusedFormControl = null;
  }

  onInputFocus(focusedFormControlName: string, e: FocusEvent): void {
    if (window.innerWidth < 1640) {
      return;
    }

    const { x, y, width, height, bottom } = (e.target as any).getBoundingClientRect();
    console.log(9999);

    if (bottom > 570) {
      this.numpadCoordinates = {
        x: x + width / 2 - 200,
        y: y - 412,
        openTop: true,
      };
    } else {
      this.numpadCoordinates = { x: x + width / 2 - 200, y: y + height + 12 };
    }
    // need for restore numpad, coused by angular bug
    this.focusedFormControl = null;
    this.cdr.detectChanges();

    this.focusedFormControl = this.form.controls[focusedFormControlName] as FormControl;
    this.cdr.markForCheck();
  }

  onNumpadClose(): void {
    this.focusedFormControl = null;
    this.dialogRef.removePanelClass(this.customPannelClasses);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
