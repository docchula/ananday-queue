import { Pipe, PipeTransform } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'elapsed'
})
export class ElapsedPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return interval(1000).pipe(
      map(_ => {
        return Math.floor((+new Date() - value) / 60000);
      })
    );
  }
}
