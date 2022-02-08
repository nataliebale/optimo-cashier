import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ICheck } from '../../../../../../shared/types/ICheck';
import { IOperator } from '../../../../../../shared/types/IOperator';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import {
  InputDialogComponent,
  InputDialogData,
} from '../../../../shared-components/popups/input-dialog/input-dialog.component';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MainProcessService } from '../../../../core/services/main-process/main-process.service';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckComponent implements OnInit {
  @Input() checks: ICheck[];
  @Input() activeCheckId: number;
  @Output() selectCheck = new EventEmitter<number>();
  @Output() deleteCheck = new EventEmitter<number>();
  @Output() addCheck = new EventEmitter();

  rand = 1;

  constructor() {}

  ngOnInit(): void {}
}
