import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-no-img',
  templateUrl: './icon-no-img.component.svg',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconNoImgComponent {}
