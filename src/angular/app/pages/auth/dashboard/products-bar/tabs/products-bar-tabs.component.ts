import { Subject } from 'rxjs';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { EventBusService, Event } from '../../../../../core/services/event-bus.service';
import { takeUntil } from 'rxjs/operators';

export enum ProductsBarTab {
  All,
  Categories,
  Suppliers,
}

@Component({
  selector: 'app-products-bar-tabs',
  templateUrl: './products-bar-tabs.component.html',
  styleUrls: ['./products-bar-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsBarTabsComponent implements OnInit, OnDestroy {
  @Output()
  change = new EventEmitter();

  @Input()
  isHorecaMode: boolean;

  private _activeTab = ProductsBarTab.All;

  set activeTab(value: ProductsBarTab) {
    this._activeTab = value;
    this.change.emit(value);
  }

  get activeTab(): ProductsBarTab {
    return this._activeTab;
  }
  ProductsBarTab = ProductsBarTab;

  private unsubscribe$ = new Subject<void>();

  constructor(private eventBus: EventBusService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.eventBus
      .on(Event.SYNCED)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.activeTab = ProductsBarTab.All;
        this.cdr.markForCheck();
      });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
