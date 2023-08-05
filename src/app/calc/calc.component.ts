import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

interface errorInterface {
  invalidDay : boolean,
  invalidMonth : boolean,
  invalidYear : boolean,
};



@Component({
  selector: 'app-calc',
  templateUrl: './calc.component.html',
  styleUrls: ['./calc.component.scss']
})
export class CalcComponent {
  months = null;
  years = null;
  days = null;
  monthsWithThirty : string[] = ['4', '6', '9', '11'];
  errors : errorInterface = {invalidDay : false, invalidMonth : false, invalidYear : false};


  inputForm : FormGroup;

  ngOnInit() {
    this.months = this.years = this.days = null;

    this.inputForm = new FormGroup({
      days : new FormControl(null, [Validators.required]),
      months : new FormControl(null, [Validators.required]),
      years : new FormControl(null, [Validators.required]),
    });
  }


  isLeapYear(year : number) : boolean {
    if (year%100 && !(year%4))
      return true;
    else if (!(year%400))
      return true;
    return false;
  }


  onSubmit() {
    const currentDate = new Date();

    const currentDay = currentDate.getDay();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const { days, months, years } = this.inputForm.value;

    this.errors.invalidMonth = (isNaN(months)) || (months > 12 || months < 1)
    
    this.errors.invalidDay = (isNaN(days)) || (days > 31 || (months == 2 && this.isLeapYear(years) && days > 29) || (months == 2 && days > 28) || (this.monthsWithThirty.includes(months) && days > 30))

    this.errors.invalidYear = (isNaN(years)) || (years > currentYear || (years == currentYear && months-1 > currentMonth) || (years == currentYear && months-1 == currentMonth && days > currentDay))

    if (this.errors.invalidDay || this.errors.invalidMonth || this.errors.invalidYear)
      return;

    var birthDate = new Date(years, months-1, days);

    const answer = Math.floor((currentDate.getTime() - birthDate.getTime()) / (1000*60*60*24));
    this.years = Math.floor(answer / 365);
    this.months = Math.floor((answer % 365) / 30);
    this.days = Math.floor(this.months % 30);
  }
}
