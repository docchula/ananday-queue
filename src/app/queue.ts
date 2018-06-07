import { Person } from 'app/person';

export interface Queue {
  name: string;
  displayName: string;
  next: string;
  queue?: {
    value: Person,
    codeStack: string[]
  }[];
}
