import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MainProcessService } from '../core/services/main-process/main-process.service';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private listen: boolean;

  readonly listener: Observable<unknown> = fromEvent(this.document, 'keyup').pipe(
    filter((val) => {
      // if (!this.listen) this.mainProcessService.logger.info('ignored keystroke', val);
      // else this.mainProcessService.logger.info('keystroke registered', val);
      // this.mainProcessService.logger.info(
      //   'dev => activeElement ',
      //   this.document.activeElement.id !== 'searchField'
      // );
      return this.listen && this.document.activeElement.id !== 'searchField';
    })
  );

  constructor(
    @Inject(DOCUMENT) private document: any,
    private mainProcessService: MainProcessService
  ) {}

  startListening(): void {
    this.listen = true;
  }

  stopListening(): void {
    this.listen = false;
  }
}
