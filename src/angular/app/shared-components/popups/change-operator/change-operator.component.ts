import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IOperator } from '../../../../../shared/types/IOperator';
import { IPaginatedResult } from '../../../../../shared/types/IPaginatedResult';
import { MainProcessService } from '../../../core/services/main-process/main-process.service';

@Component({
  selector: 'app-change-operator',
  templateUrl: './change-operator.component.html',
  styleUrls: ['./change-operator.component.scss'],
})
export class ChangeOperatorComponent implements OnInit {
  public operators: IOperator[] = [];
  public currentOperatorId;
  constructor(
    private _dialogRef: MatDialogRef<ChangeOperatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentOperatorId: number },
    private _mainProcessService: MainProcessService,
    private _cd: ChangeDetectorRef
  ) {
    this.currentOperatorId = data.currentOperatorId;
  }

  ngOnInit(): void {
    this.getOperators();
  }

  getOperators() {
    this._mainProcessService
      .getOperators()
      .toPromise()
      .then((value: IPaginatedResult<IOperator[]>) => {
        this.operators = value.data?.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this._cd.markForCheck();
      });
  }

  onClose(): void {
    this._dialogRef.close();
  }

  checkSetOperator(id: number) {
    this._mainProcessService
      .checkSetOperator(id)
      .toPromise()
      .then(() => {
        this.currentOperatorId = id;
        this.getOperators();
      });
  }
}
