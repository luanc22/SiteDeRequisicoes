import * as moment from 'moment';
import 'moment/locale/pt-br';
import { AbstractControl,ValidationErrors, ValidatorFn } from "@angular/forms";

import 'moment/locale/pt-br';

export function ValidatorDate(): ValidatorFn{
  return (input: AbstractControl): ValidationErrors | null =>{
    const dataInserida = moment(input.value);
    const hoje = moment();

    if(!dataInserida)
      return null;

    return dataInserida > hoje ? {invalidDate:true}:null;
  }
}
