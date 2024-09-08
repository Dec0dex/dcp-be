import { Column } from 'typeorm';

export class Email {
  @Column()
  email: string;

  @Column({ default: false })
  isPrimary: boolean;

  constructor(email: string, isPrimary: boolean) {
    this.email = email;
    this.isPrimary = isPrimary;
  }
}
