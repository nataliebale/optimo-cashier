import { MainProcessSetupService } from '../../../core/services/main-process/main-process.setup.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ILocation } from '../../../../../shared/types/ILocation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserType } from '../../../../../shared/enums/UserType';

@Component({
  selector: 'app-setup-location',
  templateUrl: './setup-location.component.html',
  styleUrls: ['./setup-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupLocationComponent implements OnInit, OnDestroy {
  @Input()
  role: string;

  @Input()
  userType: UserType;

  @Input()
  legalEntityId: string;

  @Output()
  locationChange = new EventEmitter<ILocation>();

  @Output()
  back = new EventEmitter<void>();

  location: ILocation;
  locationList: ILocation[];

  private unsubscribe$ = new Subject<void>();

  constructor(private setup: MainProcessSetupService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getLocations();
  }

  onSubmit(): void {
    this.locationChange.emit(this.location);
  }

  private getLocations(): void {
    console.log(this.role);

    this.setup
      .getLocations(
        this.role == 'Admin' || this.userType === UserType.Admin ? this.legalEntityId : null
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        console.log('TCL: SetupLocationComponent -> constructor -> result', result);
        this.locationList = result.data;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
