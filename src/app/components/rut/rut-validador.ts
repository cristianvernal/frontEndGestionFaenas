import { AbstractControl, ValidationErrors } from '@angular/forms';
import { validate } from 'rut.js'

export function rutValidator(control: AbstractControl): ValidationErrors | null {
    const rut = control.value;
    return rut && !validate(rut) ? { invalidRut: true } : null;
  }