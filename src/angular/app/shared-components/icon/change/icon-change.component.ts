import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-change',
  templateUrl: './icon-change.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconChangeComponent {}
