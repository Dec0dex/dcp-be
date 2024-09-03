import { Column } from 'typeorm';

export class Email {
  @Column()
  email: string;

  @Column({ default: false })
  isPrimary: boolean;
}
