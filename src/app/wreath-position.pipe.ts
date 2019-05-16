import {Pipe, PipeTransform} from '@angular/core';
import {Person} from './person';

@Pipe({
  name: 'wreathPosition'
})
export class WreathPositionPipe implements PipeTransform {

  transform(persons: (Person & { status: number; id: string })[], position: string): (Person & { status: number; id: string }) {
    return persons ? persons.find(person => person.wreath.split(',').map(s => s.trim()).includes(position)) : null;
  }

}
