import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { MainProcessService } from '../services/main-process/main-process.service';
import { OptimoProductType } from '../../../../shared/enums/OptimoProductType';

@Injectable({ providedIn: 'root' })
export class SpaceGuard implements CanActivate {
  constructor(private router: Router, private _mainProcessService: MainProcessService) {}

  canActivate(): boolean | UrlTree {
    //todo
    return this.isHorecaMode || this.router.parseUrl('dashboard');
  }

  private get isHorecaMode(): boolean {
    return this._mainProcessService?.settings?.productType === OptimoProductType.HORECA;
  }
}
