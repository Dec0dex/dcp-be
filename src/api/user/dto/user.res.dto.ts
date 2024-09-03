// import { WrapperType } from '@/common/types/types';
import { WrapperType } from '@/common/types/types';
import {
  BooleanField,
  ClassField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { EmailResDto } from './email.res.dto';
import { PhoneNumberResDto } from './phone-number.res.dto';

@Exclude()
export class UserResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  profileTag: string;

  @StringFieldOptional()
  @Expose()
  bio?: string;

  @StringFieldOptional()
  @Expose()
  profileIcon?: string;

  @StringFieldOptional()
  @Expose()
  backgroundImage?: string;

  @StringFieldOptional()
  @Expose()
  firstName?: string;

  @StringFieldOptional()
  @Expose()
  lastName?: string;

  @BooleanField()
  @Expose()
  isSuspended: boolean;

  @BooleanField()
  @Expose()
  needsEnrollment: boolean;

  @ClassField(() => PhoneNumberResDto)
  @Expose()
  phoneNumbers?: WrapperType<PhoneNumberResDto[]>;

  @ClassField(() => EmailResDto)
  @Expose()
  emails?: WrapperType<EmailResDto[]>;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
