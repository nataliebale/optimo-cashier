import { FormControl, FormGroup } from '@angular/forms';
import { EPadAction } from './EPadAction';
import { ICheckItem } from './ICheckItem';

export interface IDashboardNumpadProps {
  control: FormControl;
  group: FormGroup;
  activeAction: EPadAction;
  activeProduct: ICheckItem;
}
