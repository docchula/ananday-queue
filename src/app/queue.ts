import { Person } from 'app/person';

export interface Queue {
  name: string;
  displayName: string;
  next: string;
  queue?: {
    [key: string]: {
      value: Person,
      timeStack: string[],
      registerTime: any
    }
  };
  $key: string;
}
