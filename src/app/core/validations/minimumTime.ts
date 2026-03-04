import {FormControl } from '@angular/forms';
export function minimumTimeValidator(control: FormControl) {
    const isValid = control.value >= 10;
    return isValid ? null : { 'negativeNumber': true };
}