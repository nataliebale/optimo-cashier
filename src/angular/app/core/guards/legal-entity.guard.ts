import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class LegalEntityGuard implements CanActivate {
  constructor(private router: Router, private storage: LocalStorageService) {}

  canActivate(): boolean | UrlTree {
    //todo
    return (
      this.storage.get('entitySwitcher') === 'ი/პ გაყიდვები' || this.router.parseUrl('dashboard')
    );
  }
}
