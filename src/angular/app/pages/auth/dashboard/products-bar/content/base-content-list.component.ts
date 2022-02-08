import { OnDestroy, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent, OperatorFunction } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import { EventBusService, Event } from '../../../../../core/services/event-bus.service';

export abstract class BaseContentListComponent<T> implements OnInit, OnDestroy {
  items: T[];

  private requestItems$ = new BehaviorSubject<void>(null);
  private scrolledToEnd: boolean;
  protected pageIndex = 0;
  private totalCount: number;
  protected unsubscribe$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private eventBus: EventBusService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.requestItems$
      .pipe(debounceTime(200), this.toHttpGetItems, takeUntil(this.unsubscribe$))
      .subscribe(({ data, count }) => {
        // console.log('dev => getItemsRes:', data, count);
        this.items = this.items?.concat(data) || data;
        this.totalCount = count;
        this.scrolledToEnd = false;
        this.pageIndex++;
        this.cdr.markForCheck();
      });

    this.listenToScroll();
    this.resetOnSync();
  }

  private listenToScroll(): void {
    this.cdr.markForCheck();
    fromEvent(this.document.body, 'scroll', { passive: true, capture: true })
      .pipe(
        filter(
          ({ target }: any) =>
            !this.scrolledToEnd &&
            this.items?.length < this.totalCount &&
            target.offsetHeight + target.scrollTop >= target.scrollHeight - 20
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.scrolledToEnd = true;
        this.requestItems$.next();
      });
  }

  private resetOnSync(): void {
    this.eventBus
      .on(Event.SYNCED)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(this.reset.bind(this));
  }

  protected abstract get toHttpGetItems(): OperatorFunction<void, any>;

  protected reset(): void {
    this.pageIndex = 0;
    this.items = [];
    this.cdr.markForCheck();
    this.requestItems$.next();
  }

  trackBy(_: any, product: T): number {
    return (product as any).id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.requestItems$.complete();
  }
}
