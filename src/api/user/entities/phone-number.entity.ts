import { Column } from 'typeorm';

export class PhoneNumber {
  @Column()
  number: string;

  @Column({ default: 'mobile' })
  type: 'mobile' | 'home' | 'work';

  constructor(number: string) {
    this.number = number;
    this.type = 'mobile';
  }
}
