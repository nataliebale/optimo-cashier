import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainProcessService } from '../services/main-process/main-process.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OdinInitedGuard implements CanActivate {
  constructor(private router: Router, private odin: MainProcessService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.odin.isInited().pipe(
      map(({ data }) => {
        return data || this.router.parseUrl('setup');
      })
    );
  }
}
