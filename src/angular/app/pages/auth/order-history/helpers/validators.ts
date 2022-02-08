import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

// orderedAmount is supported for string representation of floats due to ngx-mask
export function lessThanOrEqualToOrderedOrNull(orderedAmount: number | string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const orderedAmountNumber = Number.parseFloat(control?.value?.toString());
    if (orderedAmountNumber > orderedAmount) return { 'value higher than ordered amount': true };
    if (control?.value === '' || !control?.value) return null;
    return null;
  };
}

export function higherThanZeroOrNull(control: AbstractControl): ValidationErrors | null {
  const controlValue = Number.parseFloat(control?.value?.toString());
  if (controlValue <= 0) return { 'less than or equal to zero': true };
  return null;
}

export function arrayNotEmpty(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return { controlNotProvided: true };
    if (!control?.value?.length) return { arrayIsEmpty: true };
    return null;
  };
}

export function arrayHasAtLeastOneValueSet(): ValidatorFn {
  return (controlsArray: FormArray): ValidationErrors | null => {
    const controlValues = controlsArray.getRawValue();
    const noneNullValueIndex = controlValues.findIndex(
      (controlValue) => !!controlValue.returnQuantity
    );
    console.log(
      'dev => arrayHasAtLeastOneValueSet => controlValues, noneNullValueIndex:',
      controlValues,
      noneNullValueIndex
    );
    if (noneNullValueIndex < 0) return { 'none of values are set': true };
    return null;
  };
}
