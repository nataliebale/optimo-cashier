import {
  Component,
  ChangeDetectionStrategy,
  forwardRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ProductsBarTab } from '../tabs/products-bar-tabs.component';

@Component({
  selector: 'app-products-bar-search',
  templateUrl: './products-bar-search.component.html',
  styleUrls: ['./products-bar-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductsBarSearchComponent),
      multi: true,
    },
  ],
})
export class ProductsBarSearchComponent implements ControlValueAccessor {
  private _tab: ProductsBarTab;
  placeholderLabel: string;
  @Input()
  set tab(value: ProductsBarTab) {
    this._tab = value;
    this.getPlaceholderLabel();
  }

  get tab(): ProductsBarTab {
    return this._tab;
  }

  @Input()
  hasSubtitle: boolean;

  @Output()
  focus = new EventEmitter<void>();

  @Output()
  blur = new EventEmitter<void>();

  private _value: string;

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

  onClear(): void {
    this.value = '';
    this.blur.emit();
  }
  writeValue(value: string): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  private getPlaceholderLabel(): void {
    switch (this.tab) {
      case 0:
        this.placeholderLabel = 'პროდუქტის ძიება';
        break;
      case 1:
        this.placeholderLabel = 'კატეგორიის ძიება';
        break;
      default:
        this.placeholderLabel = 'მომწოდებლის ძიება';
    }
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
