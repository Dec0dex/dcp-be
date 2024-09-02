import { Exclude, Expose } from 'class-transformer';
import {
  BooleanField,
  StringField,
} from '../../../decorators/field.decorators';

@Exclude()
export class EmailResDto {
  @StringField()
  @Expose()
  email: string;

  @BooleanField()
  @Expose()
  isPrimary: boolean;
}
