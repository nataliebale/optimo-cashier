import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Component, OnDestroy, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DialogPopupComponent } from '../../../../shared-components/popups/dialog-popup/dialog-popup.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { LoaderPopupComponent } from '../../../../shared-components/popups/loader-popup/loader-popup.component';
import { IOperator } from '../../../../../../shared/types/IOperator';
import { DOCUMENT } from '@angular/common';
import { WithdrawalDialogComponent } from '../../../../shared-components/popups/withdrawal-dialog/withdrawal-dialog.component';
import { DailySalesDialogComponent } from '../../../../shared-components/popups/daily-sales-dialog/daily-sales-dialog.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnDestroy {
  @Input()
  set operator(value: IOperator) {
    this.operatorName = value?.name.split(' ');
  }

  @Input()
  isShiftStarted: boolean;

  showDropdown: boolean;
  operatorName = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private odin: MainProcessService,
    private dialog: MatDialog,
    private router: Router,
    private storage: LocalStorageService
  ) {}

  onLogout(): void {
    this.odin
      .operatorLogOut()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigate(['/login']);
        this.storage.set('checkNumber', 1); //todo
        this.storage.set('checks', [{ id: 1, products: [] }]);
        this.storage.set('activeCheck', { id: 1 });
      });
  }

  onCloseDay(): void {
    this.dialog
      .open(DialogPopupComponent, {
        width: '560px',
        data: {
          title: 'დღის დახურვა',
          message: 'ნამდვილად გსურთ დღის დახურვა ?',
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.closeDay();
        }
      });
  }

  onOpenWithdrawalPopup(): void {
    this.dialog
      .open(WithdrawalDialogComponent, {
        width: '560px',
        panelClass: 'withdrawal-dialog-popup',
        data: {
          title: 'ცვლის დახურვა',
          message: 'ჩეკების კალათა არ არის ცარიელი, ნამდვილად გსურთ ცვლის დახურვა? ',
          approve: 'კი',
          decline: 'არა',
          loadingAfter: true,
          closeShift: true,
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
        }
      });
  }

  onOpenDailySalesDialog(): void {
    this.dialog.open(DailySalesDialogComponent, {
      width: '705px',
    });
    // .afterClosed()
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(result => {
    //   if (result) {
    //   }
    // });
  }

  onShutDown(): void {
    this.dialog
      .open(DialogPopupComponent, {
        width: '560px',
        data: {
          title: 'გათიშვა',
          message: 'ნამდვილად გსურთ გათიშვა?',
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          console.log('Shutting down');
          this.odin.shutDown().pipe(takeUntil(this.unsubscribe$)).subscribe();
        }
      });
  }

  onToggleDropdown(e?: Event): void {
    this.showDropdown = !this.showDropdown;
    if (e) {
      e.stopPropagation();
      if (this.showDropdown) {
        this.document.getElementsByTagName('html')[0].click();
      }
    }
  }

  private closeDay(): void {
    this.dialog.open(LoaderPopupComponent, {
      width: '520px',
      data: {
        message: 'დღის დახურვა',
        observable$: this.odin.closeDay(),
      },
      disableClose: true,
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
