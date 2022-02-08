import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  HostBinding,
  Inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';
import { IOperator } from '../../../../../shared/types/IOperator';
import { LocalStorageService } from './../../../services/local-storage.service';
import { NotifierPopupComponent } from '../../../shared-components/popups/notifier-popup/notifier-popup.component';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { OptimoProductType } from '../../../../../shared/enums/OptimoProductType';
import { DOCUMENT } from '@angular/common';

type Operator = IOperator & { bgColor: string };
@Component({
  selector: 'app-operators-list',
  templateUrl: './operators-list.component.html',
  styleUrls: ['./operators-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorsListComponent implements OnInit, OnDestroy {
  @ViewChild('sliderContent', { read: ElementRef })
  public sliderContent: ElementRef<any>;

  @ViewChild('sliderContentInside', { read: ElementRef })
  public sliderContentInside: ElementRef<any>;

  set selectedOperator(value: IOperator) {
    this._selectedOperator = value;
    this.storage.set('operator-data', value);
    this.operatorChange.emit(value);
  }

  get selectedOperator(): IOperator {
    return this._selectedOperator;
  }

  loggedUsers: IOperator[] = [];

  @Input()
  sync$: Observable<void>;

  @Input()
  activeShiftOperator: IOperator;

  @Input()
  isHorecaMode: boolean;

  @Output()
  operatorChange = new EventEmitter<IOperator>();

  @HostBinding('class')
  get headingClass() {
    return this.operators?.length ? null : 'flex-grow-1';
  }

  operators: Operator[][];

  /// purple, red, green, blue
  // colors = ['#3d1877', '#ff6257', '#26d4a3', '#4563ff'];
  /// blue, green, red, purple
  colors = ['#4563ff', '#26d4a3', '#ff6257', '#3d1877'];

  private _selectedOperator: IOperator;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private odin: MainProcessService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.syncListener();
    this.getOperatorsForGrid();
    fromEvent(window, 'resize', { passive: true, capture: true })
      .pipe(distinctUntilChanged(), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  onSelect(operator: IOperator): void {
    this.selectedOperator = operator;
  }

  private syncListener(): void {
    if (this.sync$) {
      this.sync$.pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
        console.log(33333, result);
        this.operators = [];
        this.cdr.detectChanges();
        this.cdr.markForCheck();

        this.getOperatorsForGrid();

        this.selectedOperator = null;
      });
    }
  }

  private getOperatorsForGrid(): void {
    this.odin
      .getOperators()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        if (data.length) {
          data = data.map((operator) => {
            if (operator.isLoggedIn) {
              this.loggedUsers.push(operator);
            }
            return {
              ...operator,
              bgColor: this.getBgColor(operator),
            };
          });
          this.operators = this.getMatrixForOperatorsArray(data as Operator[]);
        }

        //need both for css
        this.cdr.detectChanges();
        this.cdr.markForCheck();

        console.log('getOperatorsForGrid ----------');
        if (this.operators.length === 0) {
          this.openErrorPopup();
        }
      });
  }

  private getMatrixForOperatorsArray(data: Operator[]): Operator[][] {
    return data.reduce(
      (rows, key, index) =>
        (index % 5 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
      []
    );
  }

  private getBgColor(operator: IOperator): string {
    const str = operator.name[0];
    if (str.match(/[a-fA-Fა-თ]/i)) {
      return this.colors[0];
    } else if (str.match(/[g-lG-Lი-ჟ]/i)) {
      return this.colors[1];
    } else if (str.match(/[m-rM-Rრ-ყ]/i)) {
      return this.colors[2];
    }
    return this.colors[3];
  }

  private openErrorPopup(): void {
    this.dialog.open(NotifierPopupComponent, {
      width: '500px',
      data: {
        message: 'თანამშრომელი ვერ მოიძებნა',
        success: false,
      },
    });
  }

  onArrowClick(sign: boolean): void {
    const scrollLeft = this.findNextScrollNumber(sign);
    this.sliderContent.nativeElement.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }

  private findNextScrollNumber(sign: boolean): number {
    const rows = this.sliderContentInside.nativeElement.scrollWidth / this.operators.length;
    const scrollNumber = this.sliderContent.nativeElement.scrollLeft / rows;

    if (scrollNumber % 1 <= 0.2 || scrollNumber % 1 >= 0.8) {
      return (sign ? Math.round(scrollNumber) - 1 : Math.round(scrollNumber) + 1) * rows;
    }
    return (sign ? Math.floor(scrollNumber) : Math.ceil(scrollNumber)) * rows;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
