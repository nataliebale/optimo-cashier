import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumpadComponent),
      multi: true,
    },
  ],
})
export class NumpadComponent implements ControlValueAccessor {
  @Input()
  hideDot: boolean;

  @Input()
  hideBack: boolean;

  @Input()
  isDecimal: boolean;

  @Input()
  maxFractionDigits = 2;

  @Input()
  buttonsRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [0, '.'],
  ];

  private _value: number | string;

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.cdr.markForCheck();
  }

  isDisabled: boolean;

  constructor(private cdr: ChangeDetectorRef) {}

  onPadClick(key: number | string): void {
    console.log('dev => onNumpadClick', key);
    this.onTouched();
    const oldValue: string = this.value?.toString() ?? '';
    let newValue: string;
    if (
      key !== 'back' &&
      oldValue.indexOf('.') === oldValue.length - this.maxFractionDigits - 1 &&
      oldValue.indexOf('.') !== -1
    ) {
      console.log(11111111111, this.maxFractionDigits);

      return;
    }

    switch (key) {
      case 'back': {
        if (oldValue.length) {
          newValue = oldValue.substring(0, oldValue.length - 1);
        }
        break;
      }
      case '.': {
        if (!oldValue.includes('.') && this.maxFractionDigits > 0) {
          if (!oldValue.length) {
            newValue = oldValue + '0.';
          } else {
            newValue = oldValue + key;
          }
        }
        break;
      }
      case 0: {
        if (this.isDecimal && oldValue === '0') {
          return;
        }
        newValue = oldValue + key;
        break;
      }
      default: {
        newValue = oldValue + key;
      }
    }

    console.log('TCL: aside-numpad -> newValue', newValue);
    if (newValue !== undefined) {
      this.value = newValue;
    }
  }

  writeValue(value: number | string): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  onChange = (val: any) => {};

  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }
}
