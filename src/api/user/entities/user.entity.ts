import { Uuid } from '@/common/types/common.type';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Email } from './email.entity';
import { PhoneNumber } from './phone-number.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_user_id' })
  id!: Uuid;

  @Column()
  @Index('UQ_user_external_id', {
    where: '"deleted_at" IS NULL',
    unique: true,
  })
  externalId!: string;

  @Column()
  @Index('UQ_user_profile_tag', { where: '"deleted_at" IS NULL', unique: true })
  profileTag!: string;

  @Column({ default: null })
  bio?: string;

  @Column({ default: null })
  profileIcon?: string;

  @Column({ default: null })
  backgroundImage?: string;

  @Column({ default: null })
  firstName?: string;

  @Column({ default: null })
  lastName?: string;

  @Column({ default: false })
  isSuspended!: boolean;

  @Column({ default: true })
  needsEnrollment!: boolean;

  @Column('jsonb', { nullable: true, default: () => "'[]'" })
  phoneNumbers?: PhoneNumber[];

  @Column('jsonb', { nullable: true, default: () => "'[]'" })
  emails?: Email[];

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    default: null,
  })
  deletedAt: Date;
}
