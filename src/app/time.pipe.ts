import { Pipe, PipeTransform } from '@angular/core';
import * as leftPad from 'left-pad';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const date = new Date(value);
    return `${leftPad(date.getHours(), 2, '0')}:${leftPad(
      date.getMinutes(),
      2,
      '0'
    )}:${leftPad(date.getSeconds(), 2, '0')}`;
  }
}
