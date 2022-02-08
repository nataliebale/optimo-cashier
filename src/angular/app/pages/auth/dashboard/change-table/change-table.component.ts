import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ETableStatus } from '../../../../../../shared/types/ETableStatus';
import { IResult } from '../../../../../../shared/types/IResult';
import { ISpace } from '../../../../../../shared/types/ISpace';
import { ITable } from '../../../../../../shared/types/ITable';
import { ITableWithShowGuest } from '../../../../../../shared/types/ITableWithShowGuest';
import { ITableWithStatus } from '../../../../../../shared/types/ITableWithStatus';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';
import { EBoxType } from '../../../../../../shared/types/ITable';

@Component({
  selector: 'app-change-table',
  templateUrl: './change-table.component.html',
  styleUrls: ['./change-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeTableComponent implements OnInit {
  spaces$: Observable<ISpace[]> = of([]);
  tables$: Observable<ITableWithStatus[]> = of([]);
  showSpaceDropdown = false;
  ETableStatus = ETableStatus;
  EBoxType = EBoxType;
  selectedSpace: ISpace;
  constructor(
    public dialogRef: MatDialogRef<ChangeTableComponent>,
    private _mainProcessService: MainProcessService,
    private _cd: ChangeDetectorRef
  ) {
    this.getSpaces();
  }

  closeDialog(value: any) {
    this.dialogRef.close(value);
  }

  selectTable(event: Event, table: ITableWithStatus) {
    event.preventDefault();
    if (table.tableStatus === ETableStatus.busy) {
      return;
    }
    this.closeDialog(table);
  }

  toggleSpaceDropdown(value: boolean) {
    this.showSpaceDropdown = value;
  }

  getSpaces() {
    this.spaces$ = this._mainProcessService.getSpaces().pipe(
      map((loadSpacesResult: IResult<ISpace[]>) => {
        if (!this.selectedSpace && loadSpacesResult.data) {
          this.selectSpace(loadSpacesResult.data[0]);
        }
        return loadSpacesResult.data ? loadSpacesResult.data : [];
      })
    );
  }

  getTables(spaceId: number) {
    this.toggleSpaceDropdown(false);
    this.tables$ = this._mainProcessService.getTablesWithStatus(spaceId).pipe(
      map((loadTablesResult: IResult<ITableWithStatus[]>) => {
        return loadTablesResult.data
          ? loadTablesResult.data.map((table: ITableWithShowGuest) => ({
              ...table,
              arrangement: {
                height: table.arrangement?.height * ((window.screen.width - 20) / 960),
                width: table.arrangement?.width * ((window.screen.width - 20) / 960),
                left: table.arrangement?.left * ((window.screen.width - 20) / 960),
                top: table.arrangement?.top * ((window.screen.width - 20) / 960),
                boxType: table.arrangement?.boxType,
              },
            }))
          : [];
      })
    );
  }

  selectSpace(space: ISpace) {
    this.selectedSpace = space;
    this._cd.markForCheck();
    this.getTables(this.selectedSpace.id);
  }

  ngOnInit(): void {}
}
