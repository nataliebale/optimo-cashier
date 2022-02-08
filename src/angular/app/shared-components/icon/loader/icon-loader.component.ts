import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-loader',
  templateUrl: './icon-loader.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconLoaderComponent {}
