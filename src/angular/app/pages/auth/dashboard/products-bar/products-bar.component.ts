import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, takeUntil, tap, debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProductsBarTab } from './tabs/products-bar-tabs.component';
import { IStockItem } from '../../../../../../shared/types/IStockItem';
@Component({
  selector: 'app-products-bar',
  templateUrl: './products-bar.component.html',
  styleUrls: ['./products-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarComponent implements OnInit, OnDestroy {
  @Input()
  disabled: boolean;

  @Input()
  isHorecaMode: boolean;

  @Output()
  focusGroup = new EventEmitter<FormGroup>();

  @Output()
  productAdded = new EventEmitter<IStockItem>();

  searchForm: FormGroup;
  activeTab: ProductsBarTab = ProductsBarTab.All;
  searchTerm: string;

  private unsubscribe$ = new Subject<void>();
  hasSubtitle: boolean;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({ search: [''] });

    // need for update view coused by angular can not handle multiple formcontrol
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap((v) => {
          this.searchFormControl.setValue(v, { emitEvent: false });
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((v) => {
        this.searchTerm = v;
        this.cdr.markForCheck();
      });
  }

  onChangeTab(tab: ProductsBarTab): void {
    this.activeTab = tab;
    this.onResetSearchValue();
  }

  onResetSearchValue(): void {
    this.searchFormControl.setValue('');
  }

  onHasSubtitle(event: boolean): void {
    this.hasSubtitle = event;
  }

  get searchFormControl(): FormControl {
    return this.searchForm.controls.search as FormControl;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
