import {FormControl } from '@angular/forms';
export function minimumRateValidator(control: FormControl) {
    const isValid = control.value >= 5;
    return isValid ? null : { 'negativeNumber': true };
}